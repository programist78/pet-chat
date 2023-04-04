import Part1 from "@/components/Friends/Part1";
import dynamic from 'next/dynamic'

const DynamicTriangleApp = dynamic(() => import('../components/Animation/Triangles'), {
  loading: () => <p>Loading...</p>,
})
export default function Friends() {
  return (
    <>
    <Part1 />
    <DynamicTriangleApp />
    </>
  )
}
