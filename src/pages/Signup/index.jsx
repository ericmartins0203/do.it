import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { AnimationContainer, Content, Background, Container } from "./styles";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useHistory, Redirect } from "react-router-dom";

function Signup({ authenticated }) {
  const schema = yup.object().shape({
    name: yup.string().required("Campo obrigatório!"),
    email: yup.string().email("Email inválido").required("Campo obrigatório!"),
    password: yup
      .string()
      .min(8, "Mínimo de 8 digitos")
      .required("Campo obrigatório!"),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref("password")], "Senhas diferentes"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const history = useHistory();

  const onSubmitFunction = ({ name, email, password }) => {
    const user = { name, email, password };
    api
      .post("/user/register", user)
      .then((_) => {
        toast.success("Sucesso ao criar a conta");
        return history.push("/login");
      })
      .catch((err) => toast.error("Erro ao criar a conta, tente outro email"));
  };

  if (authenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <form onSubmit={handleSubmit(onSubmitFunction)}>
            <h1> Cadastro </h1>
            <Input
              register={register}
              name="name"
              icon={FiUser}
              label="Nome"
              placeholder="Seu nome completo"
              error={errors.name?.message}
            ></Input>
            <Input
              register={register}
              name="email"
              icon={FiMail}
              label="Email"
              placeholder="Seu melhor email"
              error={errors.email?.message}
            ></Input>
            <Input
              register={register}
              name="password"
              icon={FiLock}
              label="Senha"
              placeholder="Uma senha bem segura"
              type="password"
              error={errors.password?.message}
            ></Input>
            <Input
              register={register}
              name="passwordConfirm"
              icon={FiLock}
              label="Confirmação de senha"
              placeholder="Confirmação da senha"
              type="password"
              error={errors.passwordConfirm?.message}
            ></Input>

            <Button type="submit"> Enviar </Button>
            <p>
              Já tem ma conta? Faça seu <Link to="/login">login</Link>
            </p>
          </form>
        </AnimationContainer>
      </Content>
    </Container>
  );
}

export default Signup;
