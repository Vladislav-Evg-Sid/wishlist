import { useState, type ChangeEvent } from "react";
import { ToastContainer, Bounce } from "react-toastify";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import AuthLayout from "./AuthLayout";
import { useStore } from "../hooks/useStore";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { authStore } = useStore();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const isRegistration = mode === "register";

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }
  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }
  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }
  function handleConfirmPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(event.target.value);
  }
  function handleButtonClick() {
    const fetchAuth = async () => {
      if (isRegistration) {
        alert("Функция регистрации ещё не готова");
      } else {
        await authStore.login(email, password);
      }
      navigate("/");
    };
    fetchAuth();
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        theme="light"
        transition={Bounce}
      />
      <AuthLayout>
        <Typography
          sx={{
            color: "primary.main",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.14em",
            mb: 2,
          }}
        >
          ВАШИ ЖЕЛАНИЯ БЛИЖЕ
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 30, sm: 36 },
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "text.primary",
          }}
        >
          {isRegistration ? "Создайте аккаунт" : "С возвращением"}
        </Typography>
        <Typography
          sx={{ color: "text.secondary", mt: 1, mb: 4, lineHeight: 1.7 }}
        >
          {isRegistration
            ? "Сохраняйте желания и делитесь ими с близкими"
            : "Войдите, чтобы вернуться к своим желаниям"}
        </Typography>
        <Box
          component="form"
          onSubmit={(event) => event.preventDefault()}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "#FBFCFE",
            },
          }}
        >
          <TextField
            id={`${mode}-email`}
            name="email"
            label="Электронная почта"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            fullWidth
            required
          />
          {isRegistration && (
            <TextField
              id="register-username"
              name="username"
              label="Имя пользователя"
              autoComplete="username"
              value={username}
              onChange={handleUsernameChange}
              fullWidth
              required
            />
          )}
          <TextField
            id={`${mode}-password`}
            name="password"
            label="Пароль"
            type="password"
            autoComplete={isRegistration ? "new-password" : "current-password"}
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            required
          />
          {isRegistration && (
            <TextField
              id="register-confirm-password"
              name="confirmPassword"
              label="Повторите пароль"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              fullWidth
              required
            />
          )}
          <Button
            type="submit"
            onClick={() => handleButtonClick()}
            variant="contained"
            disableElevation
            sx={{
              borderRadius: "12px",
              py: 1.7,
              mt: 0.5,
              textTransform: "none",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {isRegistration ? "Зарегистрироваться" : "Войти"}
          </Button>
        </Box>
        <Typography
          sx={{
            textAlign: "center",
            color: "text.secondary",
            mt: 4,
            fontSize: 14,
          }}
        >
          {isRegistration ? "Уже есть аккаунт? " : "Нет аккаунта? "}
          <Link
            component={RouterLink}
            to={isRegistration ? "/auth" : "/register"}
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            {isRegistration ? "Войти" : "Зарегистрироваться"}
          </Link>
        </Typography>
      </AuthLayout>
    </>
  );
}
