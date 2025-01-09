import LoginStep1 from "components/users/LoginStep1";
import LoginStep2 from "components/users/LoginStep2";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "firebaseApp";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("로그인에 성공했습니다.");
      navigate("/");
    } catch (error: any) {
      toast.error(error.code);
      console.log(error);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
      const validRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    } else if (name === "password") {
      setPassword(value);

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상으로 입력해 주세요.");
      } else {
        setError("");
      }
    }
  };

  return (
		<>
			{step === 1 ? (
				<LoginStep1
					error={error}
					email={email}
					onChange={onChange}
					setStep={setStep}
				/>
			) : (
          <LoginStep2
            error={error}
            email={email}
            password={password}
            onChange={onChange}
            onSubmit={onSubmit}
            setStep={setStep}
          />
			)}
		</>
	);
}