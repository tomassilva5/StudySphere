This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Desenvolvimento: Bypass de Autenticação (Local)

Se estiveres a desenvolver a interface sem um backend de autenticação pronto, adicionámos uma forma segura e controlada de pular a verificação de autenticação localmente.

Como funciona
- O `middleware` aceita um bypass apenas quando:
	1. A variável de ambiente `DEV_AUTH_BYPASS` está ativa (valor `1` ou `true`), e
	2. Existe o cookie `devBypass=1` OU a URL contém a query param `?skipAuth=1`.

Passos rápidos
1. Ativa a flag localmente (recomendado): crie/edita `frontend/.env.local` com:

```
DEV_AUTH_BYPASS=1
```

Reinicia o servidor de desenvolvimento (dentro de `frontend/`):

```powershell
npm run dev
```

2. Define o cookie de bypass no browser (DevTools → Console):

```javascript
document.cookie = "devBypass=1; path=/";
// opcional: document.cookie = "authToken=test-token-12345; path=/";
```

3. Alternativa (query param): se `DEV_AUTH_BYPASS` estiver definida, acede:

```
http://localhost:3000/dashboard?skipAuth=1
```

Remover o bypass
- Limpa cookies (Console):

```javascript
document.cookie = "devBypass=; Max-Age=0; path=/";
document.cookie = "authToken=; Max-Age=0; path=/";
```

- Remove `DEV_AUTH_BYPASS` de `.env.local` e reinicia o servidor.

Notas de segurança
- Isto foi adicionado para facilitar testes locais. NÃO usar em produção.
- Se preferires, posso adicionar um `npm` script para iniciar o servidor com a flag definida ou reverter a alteração do `middleware` quando terminares os testes.

Arquivos relevantes
- `src/middleware.ts` — lógica de proteção e bypass.
- `src/app/loading/page.tsx` — redireciona para `/test/login` quando não autenticado.

---

## Remover o bypass (Passo-a-passo)

Quando já não precisares do bypass, segue estes passos para limpar tudo de forma segura e regressar à verificação normal:

1) Remover o bloco de bypass no `middleware`

- Abre `src/middleware.ts` e elimina o bloco que contém a verificação de `DEV_AUTH_BYPASS` e os checks `devBypass`/`skipAuth`.
- O bloco a remover começa com (exemplo):

```ts
	// Dev bypass: requer que a flag de ambiente `DEV_AUTH_BYPASS` esteja ativa
	// e que exista cookie `devBypass=1` ou query param `?skipAuth=1`.
	const devBypassEnabled =
		process.env.DEV_AUTH_BYPASS === '1' || process.env.DEV_AUTH_BYPASS === 'true';
	const hasDevCookie = request.cookies.get('devBypass')?.value === '1';
	const skipParam = request.nextUrl.searchParams.get('skipAuth') === '1';

	if (devBypassEnabled && (hasDevCookie || skipParam)) {
		return NextResponse.next();
	}
```

- Depois de o removeres, garante que o `middleware` mantém a lógica normal de verificação do token e os redirecionamentos. Um exemplo mínimo do `middleware` sem o bypass:

```ts
export function middleware(request: NextRequest) {
	const token = request.cookies.get('authToken')?.value;
	const pathname = request.nextUrl.pathname;

	if (token && ['/login', '/register'].includes(pathname)) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	if (!token && ['/dashboard', '/tasks', '/calendar', '/settings'].includes(pathname)) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}
```

2) Atualizar eventuais redirecionamentos para páginas de teste

- Se tiveres linhas que redirecionam para `/test/login`, altera-as para apontar a `/login` (ex.: `new URL('/login', request.url)`).

3) Remover a flag `DEV_AUTH_BYPASS` do ambiente

- Remove `DEV_AUTH_BYPASS=1` do ficheiro `.env.local` (ou define-o como `0`) e reinicia o servidor de desenvolvimento.

4) Limpar cookies de teste no browser

- Abre DevTools → Console e executa:

```javascript
document.cookie = "devBypass=; Max-Age=0; path=/";
document.cookie = "authToken=; Max-Age=0; path=/";
```

5) Reiniciar o servidor de desenvolvimento

- Reinicia com:

```powershell
npm run dev
```

6) Verificar

- Acede a `http://localhost:3000/dashboard` — deverás ser redirecionado para `/login` se não tiveres token.

Se quiseres, aplico eu a edição no `middleware` e faço um commit com a alteração (apenas este arquivo). Diz se queres que eu aplique e comente a alteração no commit. 
