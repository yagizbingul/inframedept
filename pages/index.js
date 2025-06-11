
import Head from 'next/head'
import { client } from '../lib/sanity'
import { useState } from 'react'

export async function getStaticProps() {
  const projects = await client.fetch(`*[_type == "project"] | order(_createdAt desc){
    _id,
    title,
    date,
    team,
    slug,
    description_tr,
    description_en,
    images,
    "imageUrl": images[0].asset->url
  }`)
  return { props: { projects } }
}

export default function Home({ projects }) {
  const [lang, setLang] = useState('tr')

  return (
    <div className="min-h-screen bg-white text-black px-6 py-8">
      <Head><title>inframedept</title></Head>
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold">inframedept</h1>
        <nav className="flex space-x-4">
          <a href="#">Projects</a>
          <a href="#">About</a>
          <span className="text-sm cursor-pointer" onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}>
            {lang === 'tr' ? 'EN' : 'TR'}
          </span>
        </nav>
      </header>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <a key={project._id} href={`/projects/${project.slug.current}`}>
            <img src={project.imageUrl || '/fallback.jpg'} alt={project.title} className="w-full h-auto mb-2" />
            <div className="font-semibold">{project.title}</div>
            <div className="text-sm text-gray-500">{project.date} · {project.team}</div>
            <p className="text-sm mt-1">
              {lang === 'tr' ? project.description_tr : project.description_en}
            </p>
          </a>
        ))}
      </main>
    </div>
  )
}
