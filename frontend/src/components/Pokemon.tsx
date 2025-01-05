import { useEffect, useState } from "react";
import styles from './Main.module.css'

interface Stat {
    name: string;
    value: number;
}

interface Pokemon {
    name: string;
    url: string;
    sprite: string;
    stats: Stat[]
}
  
interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Pokemon[];    
}

function Pokemon() {
    const [dados, setDados] = useState<Pokemon[]>([]); // Tipagem do estado

    useEffect(() => {
        fetch("http://localhost:3000/pokemons")
        .then((response) => response.json())
        .then((data: ApiResponse) => { // Tipagem explícita para a resposta da API
          if (data.results) {
            setDados(data.results);
          } else {
            console.error("Estrutura inesperada no JSON retornado:", data);
          }
        })
        .catch((error) => console.error("Erro ao buscar dados: ", error));
    }, []);

    return (
        <section className={styles["container"]}>
            <div className={styles["container-card"]}>                
                {dados.map((pokemon) => (
                    <div className={styles["card"]} key={pokemon.url}>
                        <img src={pokemon.sprite} alt={pokemon.name} />
                        <h3>{pokemon.name}</h3>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {pokemon.stats.map((stat: { name: string; value: number }) => (
                                <li key={stat.name}>
                                    {stat.name}: {stat.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}                
            </div>
        </section>
    );
}

export default Pokemon
