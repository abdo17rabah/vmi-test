# vmi-test

1. ## Backend
This Node.js application is a simple exercise to demonstrate the generation and import of CSV data into a MySQL database. The application consists of three main components:

1. csv-script : To create random data using [faker](https://www.npmjs.com/package/@faker-js/faker)
2. create-table : To create mysql table
3. csv-generator: A module responsible for generating a CSV file containing random data and import it to the table

### Setup Instructions

1. #### install Dependencies:

```bash
npm install
```

2. #### Configure MySQL:
* Don't forget to change your config in the `.env` file.
* You will need to enable the `local_infile` so this can work. To check if enabled or disabled you need to connect to mysql:
```bash
mysql -u username -p password
```
* Then type this command:
```sql
show global variables like 'local_infile';
```
* If it's disabled type this :
```sql
set global local_infile=true;
```
* Then exit mysql:
```sql
exit
```

3. #### Run the Application:
```bash
node server.js
```

4. #### Endpoints:
* `/import-csv`: Trigger the generation and import of CSV data into the MySQL database. To test it run the command :
```bash
curl -X POST http://localhost:3000/import-csv
```
* `/test`: Check if the server responds without blocking during the import process.

---

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
