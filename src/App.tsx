import Router from 'components/Router';
import { Layout } from 'components/Layout';
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { app } from "firebaseApp"
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';


function App() {
	const auth = getAuth(app)
	const [init, setInit] = useState<boolean>(false)
  // currentUser이 있으면 isAuthenticated : true
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
		!!auth.currentUser
	);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setIsAuthenticated(true)
			} else {
				setIsAuthenticated(false);
			}

			setInit(true);
		})
	}, [auth])

  return (
		<Layout>
			<ToastContainer />
			{init ? <Router isAuthenticated={isAuthenticated} /> : "loading..."}
		</Layout>
	);
}

export default App;
