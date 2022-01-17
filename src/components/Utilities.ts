function validateEmail(email: string) {
    console.log("Email", email);
    return /\S+@\S+\.\S+/.test(email);
  }

  export default { validateEmail };