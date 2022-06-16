import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  Box,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../contexts/Chat";
import { toast } from "react-toastify";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import axios from "../../Axios";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  //   const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (search) => {
    if (!search) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios
        .get(`/user?search=${search}`, config)
        .then((res) => {
          setLoading(false);
          setSearchResult(res.data);
        })
        .catch((error) => {
          setLoading(false);
          setSearchResult([]);
          console.log(error);
        });
    } catch (error) {
      setSearchResult([]);
      console.log(error);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    setRenameLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    await axios
      .put("/chat/rename", { chatId: selectedChat?._id, chatName: groupChatName }, config)
      .then((res) => {
        setSelectedChat(res.data);
        setFetchAgain(!fetchAgain);
        setGroupChatName("");
        setRenameLoading(false);
      })
      .catch((error) => {
        setRenameLoading(false);
        setGroupChatName("");
        console.log(error);
      });
  };

  const handleAddUser = async (user1) => {
    if (selectedChat?.users?.find((u) => u?._id === user1?._id)) {
      toast.error("User already in group");
      return;
    }
    if (selectedChat?.groupAdmin?._id !== user?._id) {
      toast.error("Only admin can add someone!");
      return;
    }

    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    await axios
      .put("/chat/groupadd", { chatId: selectedChat?._id, userId: user1?._id }, config)
      .then((res) => {
        setLoading(false);
        setSelectedChat(res.data);
        setFetchAgain(!fetchAgain);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const handleRemove = async (user1) => {
    if (user1._id !== user._id && selectedChat?.groupAdmin?._id !== user?._id) {
      toast.error("Only admin can remove");
      return;
    }
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    await axios
      .put("/chat/groupremove", { chatId: selectedChat?._id, userId: user1?._id }, config)
      .then((res) => {
        setLoading(false);
        user1?._id === user?._id ? setSelectedChat() : setSelectedChat(res.data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily="Work sans"
            display={"flex"}
            justifyContent="center"
          >
            {selectedChat?.chatName?.toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display="flex" flexWrap={"wrap"} pb={3}>
              {selectedChat?.users?.map((res) => (
                <UserBadgeItem key={res?._id} user={res} handleFunction={() => handleRemove(res)} />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {loading ? (
                <Box justifyContent={"center"} display="flex">
                  loading...
                </Box>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((users) => (
                    <UserListItem
                      key={users?._id}
                      user={users}
                      handleFunction={() => handleAddUser(users)}
                    />
                  ))
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
