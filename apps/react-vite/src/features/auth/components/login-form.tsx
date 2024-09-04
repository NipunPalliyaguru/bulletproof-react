import { Link, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {Form, Input, Select} from '@/components/ui/form';
import { useLogin, loginInputSchema } from '@/lib/auth';
import {useEffect, useState} from "react";
import {Team} from "@/types/api";
import {api} from "@/lib/api-client";

type LoginFormProps = {
    onSuccess: () => void;
};
export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({ onSuccess });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');


  const [teams, setTeams] = useState<Team[]>([]);


  useEffect(() => {
    api.get('/teams').then((response) => {
      setTeams(response.data);
    });
  }, []);

  // @ts-ignore
    return (
    <div>
      <Form
        onSubmit={(values) => {
          login.mutate(values);
        }}
        schema={loginInputSchema}
      >
        {({ register, formState }) => (
          <>
            <Input
              type="email"
              label="Email Address"
              error={formState.errors['email']}
              registration={register('email')}
            />
            <Input
              type="password"
              label="Password"
              error={formState.errors['password']}
              registration={register('password')}
            />
            <Select
              label="Team"
              error={formState.errors['teamId']} // Changed from teamId to teamIds
              registration={register('teamId')} 
              options={teams.map((team) => ({
                label: team.name,
                value: team.id,
              }))}
            />
            <div>
              <Button
                isLoading={login.isPending}
                type="submit"
                className="w-full"
              >
                Log in
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link
            to={`/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};