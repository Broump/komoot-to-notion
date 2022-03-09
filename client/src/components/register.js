import React from "react"
import { useState  } from "react"
import { TextInput, PasswordInput, Button, Center } from '@mantine/core';
import { EyeCheck, EyeOff } from 'tabler-icons-react';

function Register(){

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')


    return(
        <Center>
        <div>
            <TextInput
            placeholder="your username"
            label="username"
            radius="lg"
            size="md"
            required
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
            />
            <TextInput
            placeholder="example@mail.com"
            icon={<At />}
            label="email"
            radius="lg"
            size="md"
            required
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            />
            <PasswordInput
            placeholder="password"
            icon={<LockIcon />}
            label="password"
            radius="lg"
            size="md"
            required
            defaultValue="secret"
            visibilityToggleIcon={({ reveal, size }) =>
            reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
            }
            value={password} onChange={(event) => setPassword(event.currentTarget.value)}
            />
            <Button variant="outline" color="lime" radius="lg" onClick={RegisterUser}>
            register
            </Button>
        </div>
        </Center>
    )
}