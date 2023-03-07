import User from '../models/User.js'
import Messages from '../models/Messages.js'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileRenamer } from "../helpers/FileRenamer.js";
import { issueAuthToken, serializeUser } from "../helpers/index.js";
import path from "path";
import fs from  'fs'

import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { ValidationError } from 'apollo-server-koa';
import nodemailer from 'nodemailer'
import sendgridTransport from 'nodemailer-sendgrid-transport';
import { PubSub, withFilter } from 'graphql-subscriptions';
const __dirname = path.resolve();
dotenv.config()

const pubsub = new PubSub();

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
          //message
        //   messages: async () => {
        //     return await Messages.find()
        // },
        //auth
        getUser: async(_parent, {email}, _context, _info) => {
            const user = await User.findOne(
                {email}
                );
                if (!user) {
                    throw new ValidationError("Invalid email given -getUser");
                }
                return user
        },
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
            const user_from_end = await User.findByIdAndUpdate(
                user_from.id,
                {$push: { friend_sent: for_sent}},
                { new: true }
            );
            const user = await User.findByIdAndUpdate(
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
            const user_from_end = await User.findByIdAndUpdate(
                user_from.id,
                {$push: { friends: for_sent}, $pull: { friend_sent: for_sent}},
                { new: true }
            );
            const user = await User.findByIdAndUpdate(
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
            const user_from_end = await User.findByIdAndUpdate(
                user_from.id,
                {$pull: { friend_sent: for_sent}},
                { new: true }
            );
            const user = await User.findByIdAndUpdate(
                user_start.id,
                {$pull: { friend_pending: for_pending}},
                { new: true }
            );
            return user
        },
        //message
        postMessage: async (parent,{ user,  content, id }) => {
            const message = new Messages({ user, content, id })
            let result = await message.save()
            pubsub.publish('MESSAGE_SENT', { messageSent: result });
            return message.id;
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
            const user = new User({ nick, email, passwordHash, role:"USER",avatarUrl:url, status: "PENDING", confirmationCode, balance: "0", donate:"0"})
            let result = await user.save()
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
            // subscribe: () => pubsub.asyncIterator('MESSAGE_SENT')
            subscribe: withFilter(
                () => pubsub.asyncIterator('MESSAGE_SENT'),
                (payload, variables) => {
                  // Фильтрация сообщений по параметрам подписки
                  return true;
                }
              ),
              resolve: (payload) => {
                // Преобразование данных сообщения перед отправкой клиенту
                console.log(payload.messageSent._id.toString())
                return {
                  user: payload.messageSent.user,
                  content: payload.messageSent.content,
                  id: payload.messageSent._id.toString(),
                };
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
        },
      },
}

export default resolvers