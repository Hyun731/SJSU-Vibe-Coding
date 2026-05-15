import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">Reading Notes</h1>
            <p className="text-xs text-muted-foreground">Personal Library</p>
          </div>
        </div>
      </div>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground mb-4">
        <Label className="text-md" htmlFor="email">
          Email
        </Label>
        <Input
          className="mb-4 bg-inherit"
          name="email"
          placeholder="you@example.com"
          required
        />
        <Label className="text-md" htmlFor="password">
          Password
        </Label>
        <Input
          className="mb-6 bg-inherit"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Button formAction={login} className="mb-2 w-full">
          Sign In
        </Button>
        <Button
          formAction={signup}
          variant="outline"
          className="w-full mb-2"
        >
          Sign Up
        </Button>
        {params?.message && (
          <p className="mt-4 p-4 bg-destructive/10 text-destructive text-center text-sm">
            {params.message}
          </p>
        )}
      </form>
    </div>
  )
}
