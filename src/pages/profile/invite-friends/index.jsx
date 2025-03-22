import dynamic from 'next/dynamic'
const InviteFriend = dynamic(() => import('src/components/Static-Pages/InviteFriend'), { ssr: false })

const Invite_friends = () => {
  return (
    <>
      <InviteFriend />
    </>
  )
}
export default Invite_friends
