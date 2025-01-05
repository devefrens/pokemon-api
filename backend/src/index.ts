import { error } from "console";
import { Request, Response } from "express"
import express from 'express'
import cors from 'cors';
import fetch from 'node-fetch';

const app = express()
app.use(cors()); // Habilite o CORS

const url = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20';

app.get('/pokemons', async (req: Request, res: Response) => {
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Obter detalhes dos Pokémon (incluindo imagens)
        const pokemonsWithSprites = await Promise.all(
            data.results.map(async (pokemon: { name: string, url: string }) => {
                const pokemonResponse = await fetch(pokemon.url);
                const pokemonData = await pokemonResponse.json();
                
                // Extrair os atributos principais
                const stats = pokemonData.stats.map((stat: { base_stat: number; stat: { name: string } }) => ({
                    name: stat.stat.name,
                    value: stat.base_stat,
                }));

                return {
                    name: pokemon.name,
                    url: pokemon.url,
                    sprite: pokemonData.sprites.front_default, // URL da imagem padrão
                    stats: stats,
                };
            })
        );

        res.json({
            count: data.count,
            next: data.next,
            previous: data.previous,
            results: pokemonsWithSprites,
        });
    } catch(error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
    
}); 

app.listen(3000, () => {
    console.log('Server ir running port 3000.');
});
