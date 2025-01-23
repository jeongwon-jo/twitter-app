import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/common/logo.png";
import userImage from "../../assets/images/common/user_img.png";
import React, { useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import AuthContext from "context/AuthContext";
import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "firebaseApp";
import { v4 as uuidv4 } from "uuid";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";

const STORAGE_DOWNLOAD_URL_STR = "https://firebasestorage.googleapis.com";

export default function ProfileEditPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    // 파일 리더 선언
    const fileReader = new FileReader();
    // 리더가 파일을 읽음
    fileReader?.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      // 구조분해할당
      const { result } = e?.currentTarget;
      setProfileImgUrl(result);
    };
  };
  
  const handleDeleteImage = () => {
    setProfileImgUrl(null);
  };

  const onSubmit = async (e:any) => { 
    try {
			setIsSubmitting(true);
			// 이미지 이름 만들기
			const key = `${user?.uid}/${uuidv4()}`;
			// firestore 참조 걸기
			const storageRef = ref(storage, key);
      e.preventDefault();
      
			// 기존 유저 이미지가 Firebase Storage 이미지일 경우에만 삭제
			if (user?.photoURL && user.photoURL.includes(STORAGE_DOWNLOAD_URL_STR)) {
				let imageRef = ref(storage, user.photoURL);
				await deleteObject(imageRef).catch((error) => {
					console.log(error);
				});
			}
      // 이미지 업로드
      let newProfileImageUrl = "";
      if (profileImgUrl) {
        const data = await uploadString(storageRef, profileImgUrl, "data_url");
        newProfileImageUrl = await getDownloadURL(data?.ref);
      }
      // updateProfile 호출
      if (user) {
        await updateProfile(user, {
					displayName: displayName || null,
					photoURL: newProfileImageUrl || "",
        }).then(() => {
          toast.success("프로필이 업데이트 되었습니다.")
          navigate("/profile")
        }).catch((e:any) => {
          console.log(e);
        });
      }
  
			setIsSubmitting(false);
		} catch (e: any) {
      console.log(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
			target: { name, value },
		} = e;

    if (name === "displayName") {
			setDisplayName(value);
		}
  };

  useEffect(() => {
    if (user?.photoURL) {
      setProfileImgUrl(user.photoURL)
    }

    if (user?.displayName) {
      setDisplayName(user?.displayName);
    }
  }, [user?.displayName, user?.photoURL])

	return (
		<>
			<div className="logo_header">
				<button
					type="button"
					className="btn_back"
					onClick={() => {
						navigate(-1);
					}}
				></button>
				<div className="logo">
					<img src={logo} alt="로고" />
				</div>
			</div>
			<div className="container">
				<form className="profile-edit_form" onSubmit={onSubmit}>
					<div className="edit__profile">
						<div className="edit__profile-area">
							<label htmlFor="file-input" className="profile__file">
								{profileImgUrl ? (
									<div className="attachment_img">
										<div className="img_wrap">
											<img src={profileImgUrl} alt="이미지파일" />
										</div>
									</div>
								) : (
									<div className="empty_profile_img">
										<img src={userImage} alt="이미지파일" />
									</div>
								)}
							</label>
							{profileImgUrl && (
								<button
									type="button"
									className="btn_clear"
									onClick={handleDeleteImage}
								>
									<IoIosClose />
								</button>
							)}
							<input
								type="file"
								name="file-input"
								accept="image/*"
								id="file-input"
								onChange={handleFileUpload}
								className="hidden"
							/>
						</div>
						<div className="profile-info__list-area">
							<div className="profile-info__item">
								<label htmlFor="displayName">이름</label>
								<input
									type="text"
									id="displayName"
									name="displayName"
									className="profile-img__input"
									placeholder="이름"
									onChange={onChange}
									value={displayName}
								/>
							</div>
						</div>

						<div className="profile__submit-area">
							<input
								type="submit"
								value="프로필 수정"
								className="profile__submit-btn"
								disabled={isSubmitting}
							/>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
