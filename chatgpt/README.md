# vmi-test

3. ## Chatgpt
Le problème que l'excercice essaye de corriger et ce qu'on appelle ‘race conditions’ avec UseEffect. 

Dans la partie asynchrone du code de la soulution proposé par chatgpt, il y a un risque que le fetch soit finit après que le `query` prop soit changé. Si la prop change alors que la fonction `fetchData` n’a pas encore finit on se retrouve avec un résultat de l'ancienne query.

Ainsi que la fonction du `cleanUp` n’annule pas la requête en cours, elle affecte juste une variable null à la variable.

Le code aussi ne considère pas la possibilité qu’il y aura une erreur avec le fetch (Ex: Api down) du coup on aura le code qui throw une error et on aura aucune data et l’utilisateur sera confus.

Ma solution proposée est:
```javascript
export default function Demo() {
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState('react');

    const abortControllerRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            // Before attempting anything related to fetching, we cancel the abortController only if and only if it exists. Then, we create a new abortController and assign it to the reference.
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            setIsLoading(true);

          try {
            const response = await fetch(`https://api.example.com/data?query=${query}`, { signal : abortControllerRef.current?.signal });
            const result = await response.json();
            setData(result);
          } catch (error) {
            if (e.name === "AbortError") {
                console.log("Aborted");
                return;
            }
            console.error('Error fetching data:', error);
          } finally {
            setIsLoading(false);
          }
        }
      
        fetchData();
      
        return () => {
          abortController.abort(); // This will cancel the fetch request if it's still ongoing
        };
      }, [query]);
}
```
