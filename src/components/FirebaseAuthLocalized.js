import firebase from 'firebase/compat/app';
import React, { useEffect, useRef, useState } from "react";

const FIREBASEUI_CONTAINER_ID = "firebaseui_container";
const auth = firebase.auth();
const config = {
  signInFlow: 'redirect',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

// Original code: https://github.com/greg-schrammel/react-firebaseui-localized
function FirebaseUIAuth({version}) {
  const state = useScript(`https://www.gstatic.com/firebasejs/ui/${version}/firebase-ui-auth.js`);
  const container = useRef();
  const app = useRef();

  useEffect(() => {
    if (firebase) {
      window.firebase = firebase;
    }
  }, []);

  useEffect(() => {
    if (state.value === "loading") {
      return;
    }
    else if (state.value === "error") {
      throw state.payload;
    }

    (async () => {
      if (app.current) {
        await app.current.delete();
      }
      container.current.innerHTML = "";
      const firebaseUI = window.firebaseui.auth.AuthUI.getInstance() || new window.firebaseui.auth.AuthUI(auth);
      firebaseUI.start(`#${FIREBASEUI_CONTAINER_ID}`, config);
      app.current = window.firebase.app("[DEFAULT]-firebaseui-temp");
    })();
    return () => window.firebaseui.auth.AuthUI.getInstance().delete();
  }, [auth, config, state.value]);

  return (
    <>
      <link type="text/css" rel="stylesheet" href={`https://www.gstatic.com/firebasejs/ui/${version}/firebase-ui-auth.css`}/>
      <div ref={container} id={FIREBASEUI_CONTAINER_ID} />
    </>
  );
}


function useScript(src) {
  const [state, setState] = useState({ value: "loading", payload: undefined }); // value { loading | loaded | error }
  const script = useRef();

  useEffect(() => {
    script.current = document.createElement("script");
    script.current.src = src;
    script.current.async = true;

    const onScriptLoad = () => setState({ value: "loaded" });

    const onScriptError = (e) => {
      script.current.remove();
      setState({ value: "error", payload: e });
    };

    script.current.addEventListener("load", onScriptLoad);
    script.current.addEventListener("error", onScriptError);

    document.body.appendChild(script.current);
    return () => {
      script.current.removeEventListener("load", onScriptLoad);
      script.current.removeEventListener("error", onScriptError);
    };
  }, [src]);

  return state;
}

export default FirebaseUIAuth;