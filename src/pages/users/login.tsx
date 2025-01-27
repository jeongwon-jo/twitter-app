import LoginStep1 from "components/users/LoginStep1";
import LoginStep2 from "components/users/LoginStep2";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
  const t = useTranslation();
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
      toast.success(t("TOAST_LOGIN_COMPLETE"));
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
        setError(t("VALIDATION_EMAIL1"));
      } else {
        setError("");
      }
    } else if (name === "password") {
      setPassword(value);

      if (value?.length < 8) {
        setError(t("VALIDATION_PWD1"));
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