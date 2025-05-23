import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const languages = [
  { code: 'pt-BR', label: 'Português', flag: '/assets/flags/brazil.svg' },
  { code: 'en', label: 'English', flag: '/assets/flags/usa.svg' },
  { code: 'es', label: 'Español', flag: '/assets/flags/spain.svg' },
  { code: 'fr', label: 'Français', flag: '/assets/flags/france.svg' },
  { code: 'ar', label: 'العربية', flag: '/assets/flags/arabic.svg' },
]

export default function LanguageSelector() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const current = languages.find(l => l.code === i18n.language) || languages[0]

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang)
    setOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <button
        className="inline-flex items-center px-3 py-1 border border-yellow-400 rounded-md text-yellow-400 bg-transparent"
        onClick={() => setOpen(prev => !prev)}
      >
        <Image src={current.flag} alt={current.label} width={20} height={14} className="mr-2" />
        {current.label}
        <span className="ml-2">▾</span>
      </button>

      {open && (
        <ul className="absolute z-10 mt-2 bg-white text-black border border-gray-300 rounded-md w-full">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => handleChange(lang.code)}
                className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
              >
                <Image src={lang.flag} alt={lang.label} width={20} height={14} className="mr-2" />
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
