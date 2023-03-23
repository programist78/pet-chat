import User from '../models/User.js'
import Messages from '../models/Messages.js'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileRenamer } from "../helpers/FileRenamer.js";
import { issueAuthToken, serializeUser } from "../helpers/index.js";
import path from "path";
import fs from  'fs'
import mongoose from 'mongoose';
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { ValidationError } from 'apollo-server-koa';
import nodemailer from 'nodemailer'
import sendgridTransport from 'nodemailer-sendgrid-transport';
import { PubSub, withFilter } from 'graphql-subscriptions';
import Friends from '../models/Friends.js';
import Chat from '../models/Chat.js';
const __dirname = path.resolve();
dotenv.config()

const pubsub = new PubSub();

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        getMessages: async (_parent, {id}, _context, _info) => {
            let chat = await Chat.findById(id)
            if (!chat) {
                throw new ValidationError("Invalid id given - getMessages");
            }
            let messages = chat.messages.slice(-100).map((message) => {
                return message
            })
            return messages
        },
        getUser: async(_parent, {input}, _context, _info) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let user
            if(emailRegex.test(input)) {
                
                    user = await User.findOne(
                        {email: input}
                        );
                        if (!user) {
                            throw new ValidationError("Invalid nick given -getUser");
                        }
            } else {
                user = await User.findOne(
                    {nick: input}
                    );
                    if (!user) {
                        throw new ValidationError("Invalid nick given -getUser");
                    }
            }
                return user
        },
        getFriends: async(_parent, {email}, _context, _info) => {
            const user = await Friends.findOne(
                {email}
                );
                if (!user) {
                    throw new ValidationError("Invalid email given -getFriends");
                }
                return user.friends
        },
        getSent: async(_parent, {email}, _context, _info) => {
            const user = await Friends.findOne(
                {email}
                );
                if (!user) {
                    throw new ValidationError("Invalid email given -getFriends");
                }
                return user.friend_sent
        },
        getPending: async(_parent, {email}, _context, _info) => {
            const user = await Friends.findOne(
                {email}
                );
                if (!user) {
                    throw new ValidationError("Invalid email given -getFriends");
                }
                return user.friend_pending
        },
        getChats: async (_parent, {email}, _context, _info) => {
            const user = await User.findOne({email})
            const list = await Promise.all(
                user.chats.map((chat) => {
                    return Chat.findById(chat)
                }),
                )
            return list
        }
    },
    
    Mutation: {
        //friends
        sendFriendRequest: async (parent, {from_email, nick}) => {
            const user_from = await User.findOne(
                {email: from_email}
                );
                if (!user_from) {
                    throw new ValidationError("Invalid email given");
                }
            const user_start = await User.findOne(
                {nick}
                );
                if (!user_start) {
                    throw new ValidationError("User is undefined");
                }
                const for_sent = {email: user_start.email, nick: user_start.nick}
                const for_pending = {email: user_from.email, nick: user_from.nick}
            const user_from_end = await Friends.findByIdAndUpdate(
                user_from.id,
                {$push: { friend_sent: for_sent}},
                { new: true }
            );
            const user = await Friends.findByIdAndUpdate(
                user_start.id,
                {$push: { friend_pending: for_pending}},
                { new: true }
            );
            return user
        },
        acceptFriendRequest: async (parent, {from_email, to_email}) => {
            const user_start = await User.findOne(
                {email: to_email}
                );
                if (!user_start) {
                    throw new ValidationError("User is undefined");
            }
            const user_from = await User.findOne(
                {email: from_email}
                );
                if (!user_from) {
                    throw new ValidationError("Invalid email given");
            }
            const for_sent = {email: user_start.email, nick: user_start.nick}
            const for_pending = {email: user_from.email, nick: user_from.nick}
            const user_from_end = await Friends.findByIdAndUpdate(
                user_from.id,
                {$push: { friends: for_sent}, $pull: { friend_sent: for_sent}},
                { new: true }
            );
            const user = await Friends.findByIdAndUpdate(
                user_start.id,
                {$push: { friends: for_pending}, $pull: { friend_pending: for_pending}},
                { new: true }
            );
            return user
        },
        rejectFriendRequest: async (parent, {from_email, to_email}) => {
            const user_start = await User.findOne(
                {email: to_email}
                );
                if (!user_start) {
                    throw new ValidationError("User is undefined");
            }
            const user_from = await User.findOne(
                {email: from_email}
                );
                if (!user_from) {
                    throw new ValidationError("Invalid email given");
            }
            const for_sent = {email: user_start.email, nick: user_start.nick}
            const for_pending = {email: user_from.email, nick: user_from.nick}
            const user_from_end = await Friends.findByIdAndUpdate(
                user_from.id,
                {$pull: { friend_sent: for_sent}},
                { new: true }
            );
            const user = await Friends.findByIdAndUpdate(
                user_start.id,
                {$pull: { friend_pending: for_pending}},
                { new: true }
            );
            return user
        },
        deleteFriend: async (parent, {from_email, to_email}) => {
            const user_start = await User.findOne(
                {email: to_email}
                );
                if (!user_start) {
                    throw new ValidationError(`User is undefined --deleteFriend ${to_email} and ${from_email}`);
            }
            const user_from = await User.findOne(
                {email: from_email}
                );
                if (!user_from) {
                    throw new ValidationError("Invalid email given");
            }
            const for_sent = {email: user_start.email, nick: user_start.nick}
            const for_pending = {email: user_from.email, nick: user_from.nick}
            const user_from_end = await Friends.findByIdAndUpdate(
                user_from.id,
                {$pull: { friends: for_sent}},
                { new: true }
            );
            const user = await Friends.findByIdAndUpdate(
                user_start.id,
                {$pull: { friends: for_pending}},
                { new: true }
            );
            return user
        },
        //message
        postMessage: async (parent,{ user,  content, id}) => {
            const chat = await Chat.findById(
                id
                );
                if (!chat) {
                    throw new ValidationError("Chat is undefined");
                }
            const chat2 = await Chat.findByIdAndUpdate(
                chat.id,
                {lastMessage: {user, content, _id: mongoose.Types.ObjectId()} ,$push: { messages: {user, content, _id: mongoose.Types.ObjectId()}}},
                { new: true }
                );
                if (!chat2) {
                    throw new ValidationError("Invalid email given- changestatus");
                }
            let result = await chat2.messages.slice(-1)[0]
            console.log(result)
            pubsub.publish(`CHAT_${id}`, { messages: result });
            // pubsub.publish(`CHAT_${id}`);
            return result;
        },
        //chat
        createChat: async (parent, {email1, email2}) => {
            const user1 = await User.findOne(
                {email: email1}
                );
                if (!user1) {
                    throw new ValidationError("Invalid email given- changestatus");
                }
                const user2 = await User.findOne(
                    {email: email2}
                    );
                    if (!user2) {
                        throw new ValidationError("Invalid email given- changestatus");
                    }
                // const newuser = await User.findByIdAndUpdate(
                //     id,
                //     {status: "ACTIVE"},
                //     { new: true }
                // );
            const chat = new Chat({ user1: user1.email, user2: user2.email, lastMessage: "" })
            let result = await chat.save()
            const user1_2 = await User.findByIdAndUpdate(
                user1.id,
                {$push: { chats: chat.id}},
                { new: true }
                );
                if (!user1) {
                    throw new ValidationError("Invalid email given- changestatus");
                }
            const user2_2 = await User.findByIdAndUpdate(
                user2.id,
                {$push: { chats: chat.id}},
                { new: true }
                );
                if (!user2) {
                    throw new ValidationError("Invalid email given- changestatus");
                }
            return result
        },
        //auth
        registerUser: async(parent, args, context, info) => {
            try {
                const {email, password, nick} = args.about
            const already_exsist = await User.findOne({ email });
            if (already_exsist) {
            throw new ValidationError("Email already exists");
            }
            const url = "http://localhost:4000/defaultperson.png"
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            let math = Math.random() * (43564389374833)
            let confirmationCode = Math.round(math)
            const user = new User({ nick, email, passwordHash, role:"ADMIN",avatarUrl:url, status: "PENDING", confirmationCode, balance: "0", donate:"0"})
            const friends = new Friends({ email, _id: user.id })
            let result = await user.save()
            await friends.save()
            result = await serializeUser(result);
            //transporter
            const transporter = nodemailer.createTransport(
                sendgridTransport({
                    auth:{
                        api_key:process.env.SENDGRID_APIKEY,
                    }
                })
            )
            let mailOptions = { from: process.env.FROM_EMAIL, to: user.email, subject: 'Account Verification Link', text: 'Hello '+ user.fullname +',\n\n' + 'Please verify your account by clicking the link: \nhttp://localhost:3000/' + 'auth/confirmation/' + confirmationCode + '\n\nThank You!\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { 
                return console.log(err)
            }})
            const token = await issueAuthToken({email, role: user.role});
            console.log(token)
             //end trans
            return {token, user}
            } catch (err) {
                throw (err.message);
            } 
            
            
        },
        changeStatus: async (parent,{id, confirmationCode}, args) => {
            const user = await User.findById(
                {_id:id}
                );
                if (!user) {
                    throw new ValidationError("Invalid email given- changestatus");
                }
                const isValidPass = (confirmationCode == user.confirmationCode);
            if (!isValidPass) {
                throw new ValidationError("Invalid confirmationCode given!");
            }
            const newuser = await User.findByIdAndUpdate(
                id,
                {status: "ACTIVE"},
                { new: true }
            );
            return newuser
        },
        loginUser: async (_, args, context, info) => {
            const { email, password } = args.about
            // const {id} = args
            // console.log(id)
            const user = await User.findOne(
            {email}
            );
            if (!user) {
                throw new ValidationError("Invalid email given - loginUser");
            }
            const isValidPass = await bcrypt.compare(password, user.passwordHash);
            if (!isValidPass) {
                throw new ValidationError("Invalid password given!");
            }
            let result = await user.save()
            result = await serializeUser(result);
            // let token = "sgshhshs"
            const token = await issueAuthToken({email, role: user.role});
            return {user, token}
        },
        changeUserLogo: async (parent,{ file, id}, args) => {
            let url = {}
            for (let i = 0; i < file?.length; i++) {
            const { createReadStream, filename, mimetype } = await file[i];
            const stream = createReadStream();
            const assetUniqName = fileRenamer(filename);
            const pathName = path.join(__dirname,   `./uploads/${assetUniqName}`);
            await stream.pipe(fs.createWriteStream(pathName));
            const urlForArray = `${process.env.HOST}/${assetUniqName}`;
            url = urlForArray 
            }
            const user = await User.findByIdAndUpdate(
                id,
                {avatarUrl: url},
                { new: true }
            );
            return user
        }
    },
    Subscription: {
        messages: {
            // subscribe: (_, { id }) => pubsub.asyncIterator([`CHAT_${id}`])
            //1
            // subscribe: withFilter(
            //     (_, { id }) => pubsub.asyncIterator(`CHAT_${id}`),
            //     (payload, variables) => {
            //       return true;
            //     }
            //   ),
            //   resolve: (payload) => {
            //     console.log(payload)
            //     return {
            //       user: payload.messageSent.user,
            //       content: payload.messageSent.content,
            //       _id: payload.messageSent._id.toString(),
            //     };
            //   },
            //2
            subscribe: (parent, { id }) => {
                return pubsub.asyncIterator(`CHAT_${id}`);
              }
            },
        //   subscribe: (parent, args, { pubsub }) => {
        //     const channel = Math.random().toString(36).slice(2, 15);
        //     onMessageUpdate(() => {
        //       pubsub.publish(channel, { messages });
        //     });
        //     setTimeout(() => {
        //       pubsub.publish(channel, { messages });
        //     }, 0);
        //     return pubsub.asyncIterator(channel);
        //   },

        messageAdded: {
            subscribe: (_, { chatId }) => pubsub.asyncIterator(`CHAT_${chatId}`)
          },
      },
}

export default resolvers