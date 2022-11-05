import { useNavigation } from "@react-navigation/native";
import { Heading, useToast, VStack } from "native-base";
import { useState } from "react";

import { Button } from "../components/Button";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  const toast = useToast();
  const { navigate } = useNavigation();

  function errorHandler(message) {
    return toast.show({
      title: message,
      placement: "top",
      bgColor: "red.500",
    })
  }

  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return errorHandler('Código inválido');
      }

      await api.post('/pools/join', { code });

      toast.show({
        title: 'Você entrou no bolão com sucesso',
        placement: "top",
        bgColor: "green.500",
      })

      setCode('');
      setIsLoading(false);
      navigate('pools');

    } catch (e) {
      console.error(e);
      setIsLoading(false);
      const message = e.response?.data?.message;
  
      if(message === "Pool not found") {
        return errorHandler('Boleto não encontrado');
      }
      if(message === "User already joined this pool") {
        return errorHandler('Você já está nesse bolão');
      }
      errorHandler('Oh não, algo deu errado');
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="lg" mb={8} textAlign="center" >
          Encontrar um bolo através de {'\n'}
          seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button 
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}