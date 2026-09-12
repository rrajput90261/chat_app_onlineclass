import {useState} from 'react'

export default function App() {


  const [value, setvalue] = useState(0)
  const [value2, setvalue2] = useState(0)
  const [res, SetRes] = useState('Result')

  const AllBtn = [
    { name: 'Pos or Neg', function: () => { value > 0 ? SetRes('Pos') : SetRes('Neg') }, css: 'bg-orang-600' },
    { name: 'Even or Odd', function: () => { value % 2 == 0 ? SetRes('Even') : SetRes('Odd') }, css: 'bg-gray-600' },
    { name: 'leep or not', function: () => { value > 0 ? SetRes('leep') : SetRes('not') }, css: 'bg-blue-500' },
    { name: 'binay or not', function: () => { value > 0 ? SetRes('binary') : SetRes('not') }, css: 'bg-red-900' },
    { name: 'A & B', function: () => { parseInt(value) > parseInt(value2) ? SetRes('A') : SetRes('B') }, css: 'bg-green-100' },
  ];
  return (
    <div className='flex justify-center items-center bg-gray-700 min-h-screen'>

      <div className='bg-amber-100 w-150 rounded-lg shadow-lg px-10 shadow-amber-950'>
        <h1 className='text-center text-3xl font-semibold uppercase py-4'>Number Checker </h1>

        <div className='flex gap-5'>
          <input onChange={(e) => { setvalue(e.target.value) }} className='shadow-lg py-3 px-5 w-full bg-gray-100' type="number" />
          <input onChange={(e) => { setvalue2(e.target.value) }} className='shadow-lg py-3 px-5 w-full bg-gray-100' type="number" />
        </div>
        <div className='py-5 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
          {
            AllBtn.map((v,i)=>(

              <button onClick ={v.function} key={i} className={`${v.css} text-white px-10 rounded-md hover:scale-110 duration-300`}>{v.name}</button>
            ))

          }


        </div>
        <p className='text-center py-5 text-5xl font-semibold'>{res}</p>
      </div>
    </div>
  )
}
