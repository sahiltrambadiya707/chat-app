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

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast.error("some values is missing");
      setLoading(false);
      return;
    }

    const body = {
      email,
      password,
    };

    await axios
      .post("/user/login", body)
      .then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        setLoading(false);
        history.push("/chats");
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
        <Button
          _hover={{
            background: "#2c5282",
            color: "#bee3f8",
          }}
          bg={"#bee3f8"}
          color="#2c5282"
          w="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
          colorScheme="red"
          variant="solid"
          w="100%"
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    </>
  );
};

export default Login;
