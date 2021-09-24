import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router";
import Input from "../../components/Input";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { Container, InputContainer, TaskContainer } from "./styles";
import { FiEdit2 } from "react-icons/fi";
import api from "../../services/api";
import { toast } from "react-toastify";

function Dashboard(authenticated) {
  const [tasks, setTasks] = useState([]);
  const [token] = useState(
    JSON.parse(localStorage.getItem("@Doit:token")) || ""
  );
  const { register, handleSubmit } = useForm();

  function loadTask() {
    api
      .get("/taks", {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        params: {
          completed: false,
        },
      })
      .then((response) => {
        const apiTask = response.data.data.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        }));
        setTasks(apiTask);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    loadTask();
  }, []);

  const onSubmit = ({ task }) => {
    if (!task) {
      return toast.error("Complete o campo para enviar uma tarefa");
    }

    api
      .post(
        "/task",
        {
          description: task,
        },
        {
          headers: {
            Authorization: `Bearer: ${token}`,
          },
        }
      )
      .then((response) => loadTask());
  };

  const handleCompleted = (id) => {
    const newTasks = tasks.filter((task) => task._id !== id);

    api
      .put(
        `/task/${id}`,
        { completed: true },
        {
          headers: {
            Authorization: `Bearer: ${token}`,
          },
        }
      )
      .then((response) => setTasks(newTasks));
  };

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <Container>
      <InputContainer onSubmit={handleSubmit(onSubmit)}>
        <time>7 de maio de 2021</time>
        <section>
          <Input
            icon={FiEdit2}
            placeholder="Nova tarefa"
            register={register}
            name="task"
          />
          <Button type="submit">Adivionar</Button>
        </section>
      </InputContainer>
      <TaskContainer>
        {tasks.map((task) => (
          <Card
            key={task._id}
            title={task.description}
            date={task.createdAt}
            onClick={() => handleCompleted(task._id)}
          />
        ))}
      </TaskContainer>
    </Container>
  );
}

export default Dashboard;
