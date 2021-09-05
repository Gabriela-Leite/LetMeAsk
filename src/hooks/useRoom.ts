import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type Questions = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {authorId : string}>;
  }
>;

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState("");
  const history = useHistory();

  useEffect(() => {
    const handleCodeRoom = async () => {
      if (roomId.trim() === "") {
        return;
      }
      const roomCode = await database.ref(`rooms/${roomId}`).get();
      if (!roomCode.exists()) {
        history.push("/error");
        return;
      }
      const roomRef = database.ref(`rooms/${roomId}`);
      roomRef.on("value", (room) => {
        const databaseRoom = room.val();
        const firebaseQuestions: FirebaseQuestions =
          databaseRoom.questions ?? {};

          const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighlighted: value.isHighlighted,
              isAnswered: value.isAnswered,
              likeCount: Object.values(value.likes ?? {}).length,
              likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
            }
          })
    
          setTitle(databaseRoom.title);
          setQuestions(parsedQuestions);
        })
      return()=> {
        roomRef.off('value');
      }
    };
    handleCodeRoom();
  }, [history, roomId, user]);

  return{ questions, title};
}
