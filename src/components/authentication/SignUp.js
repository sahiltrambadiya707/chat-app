import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../Axios";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const postDetails = async (pics) => {
    if (pics) {
      setLoading(true);
      if (pics === undefined) {
        toast.error("Please select an image");
      }
      if (pics?.type === "image/jpeg" || pics?.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chatapp");
        data.append("cloud_name", "dvrbxb78e");
        await axios
          .post("https://api.cloudinary.com/v1_1/dvrbxb78e/image/upload", data)
          .then((res) => {
            setPic(res.data.url.toString());
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      } else {
        toast.error("Please select an image");
        setLoading(false);
        return;
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast.error("some values is missing");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password is not same");
      setLoading(false);
      return;
    }

    const body = {
      name,
      email,
      password,
      pic,
    };

    await axios
      .post("/user/register", body)
      .then((res) => {
        localStorage.setItem("userInfo", res?.data);
        toast.success("user register successfully");
        history.push("/chats");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("something went wrong");
        setLoading(false);
      });
  };

  return (
    <>
      <VStack spacing="5px" color="black">
        <FormControl id="firstName" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="5m" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="cPassword" isRequired>
          <FormLabel>ConfirmPassword</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Re-Enter Your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="5m" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Upload Your Picture</FormLabel>
          <Input
            type="file"
            p="1.5"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>
        <Button
          bgColor={"#bee3f8"}
          _hover={{
            background: "#2c5282",
            color: "#bee3f8",
          }}
          color="#2c5282"
          w="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </>
  );
};

export default SignUp;
