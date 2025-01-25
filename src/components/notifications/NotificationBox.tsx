import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { NotificationProps } from "pages/notification";
import { useNavigate } from "react-router-dom";

export default function NotificationBox({notification} : {notification: NotificationProps}) {
  const navigate = useNavigate();
  const onClickNotifiction = async (url: string) => {
    // isRead 업데이트
    const ref = doc(db, "notifications", notification.id)
    await updateDoc(ref, {
      isRead: true,
    })
    navigate(url)
  }

  return (
    <div className="notification">
      <div onClick={() => onClickNotifiction(notification.url) }>
        <div className="notification__flex">
          <div className="notification__createdAt">{notification.createdAt}</div>
          {notification.isRead === false && (
              <div className="notification__unread"></div>
          )}
        </div>
        <div className="notification__content">{notification.content}</div>
      </div>
    </div>
    
  )
}