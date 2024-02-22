import { useState,  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signin=()=>{
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [popup, setPopup] = useState({ visible: false, success: false });
  const popupClosing = () => {
    setPopup({ visible: false, success: false });
  };
    const navigate = useNavigate();
    return <div>
        <div className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
            <h2 className="inline-flex mb-4 text-xl font-bold text-gray-900 dark:text-white">Begin Your Journey with Us</h2>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sign in </label>
                            <input onChange={e => {setEmail(e.target.value)}} type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="example@gmail.com"/>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">password </label>
                            <input onChange={e => {setPassword(e.target.value)}} type="text" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="password"/>
                        </div>
                    </div>
                    <button onClick={async () => {
          try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
              email,
              password
            });

            localStorage.setItem("token", response.data.token);
            setPopup({ visible: true, success: true });
            navigate("/dashboard");
          } catch (error) {
            setPopup({ visible: true, success: false });
            console.error("Signup failed:", error);
          }
        }} type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    Sign in
                    </button>
                    <img className=" mb-4 px-7 " draggable="false" src="https://cdni.iconscout.com/illustration/premium/thumb/login-screen-page-9959136-8111279.png"/>
            {/*Popup logic start */}
            {popup.visible && (
        <div className={`popup ${popup.success ? "success" : "failure"}`}>
            <svg className="inline-flex w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.6-8.5h0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <p className="inline-flex text-red-600">{popup.success ? "Signup successful!" : "Signup failed. Please try again."}</p>
          <button type="button" className="my-8 mx-8  text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900" onClick={popupClosing}>close</button>
        </div>
      )}
            {/* Popup logic end */}
            </div>
        </div> 
    </div>
}

export default Signin;