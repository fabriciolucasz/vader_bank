'use client'

import { Link } from '@chakra-ui/next-js'
import Header from '@/components/Header';

export default function Page() {
  return (
    <div>
      <Header />
      <main>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Malvader Bank</h1>
          <p className="text-gray-700">
            Aqui você pode gerenciar suas contas, fazer transferências e muito mais!
          </p>
        </div>
      </main>
    </div>
  )
}
