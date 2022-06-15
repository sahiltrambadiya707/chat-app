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
  FormControl,
  Input,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { ChatState } from "../../contexts/Chat";
import axios from "../../Axios";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();
  const { user, chats, setChats } = ChatState();

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

  const handleGroup = async (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast.warning("User already added");
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };

  const handleDelete = async (delUser) => {
    setSelectedUser(selectedUser.filter((sel) => sel?._id !== delUser?._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUser) {
      toast.error("Please fill all the felids");
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
        .post(
          "chat/group",
          {
            name: groupChatName,
            users: JSON.stringify(selectedUser?.map((u) => u?._id)),
          },
          config
        )
        .then((res) => {
          setLoading(false);
          setChats([res?.data, ...chats]);
          onClose();
          toast.success("new Group chat is created");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                mb={3}
                placeholder="Chat Name"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                mb={1}
                placeholder="Add User eg: Sahil, Deepika"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {selectedUser
              ? selectedUser?.map((u) => (
                  <UserBadgeItem key={u?._id} user={u} handleFunction={() => handleDelete(u)} />
                ))
              : null}
            {loading ? (
              <div>loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((users) => (
                  <UserListItem
                    key={users?._id}
                    user={users}
                    handleFunction={() => handleGroup(users)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
