interface HomeProps {
  count: number;
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Hello World</h1>
      <p>Count: {props.count}</p>
    </div>
  )
}

export const getServerSideProps = async () => {
  const response = await fetch('http://localhost:3000/pools/count')
  const data = await response.json()
  console.log(data)
  return {
    props: {
      count: data.count,
    }
  }
}