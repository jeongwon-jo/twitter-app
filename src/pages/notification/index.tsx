import Loader from "components/loader/Loader";
import { LogoHeader } from "components/LogoHeader";
import NotificationBox from "components/notifications/NotificationBox";
import AuthContext from "context/AuthContext";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export interface NotificationProps {
  id: string;
  uid: string;
  url: string;
  isRead: boolean;
  content: string;
  createdAt: string
}
export default function NotificationPage() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  useEffect(() => {
    if(user) {
      let ref = collection(db, "notifications");
      let notificationQuery = query(ref, where("uid", "==", user.uid), orderBy("createdAt", "desc"))

      onSnapshot(notificationQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }))

        setNotifications(dataObj as NotificationProps[])
      })
    }
  }, [user])
  
  return (
    <div className="home">
      <LogoHeader />
      <div className="container">
        <div className="post">
          {notifications?.length > 0 ? notifications?.map((noti) => (
            <NotificationBox key={noti.id} notification={noti} />)):
          <div className="post__no-posts">
            <div className="post__text">알림이 없습니다.</div>
          </div>}
        </div>
      </div>
    </div>
  )
}