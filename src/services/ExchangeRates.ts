import { invoke } from '@tauri-apps/api/core';





export async function fetchExchangeRates() {
  try {
    const exchangeRates = await invoke('get_exchange_rates' , { limit: 10, offset: 0 });
    console.log('Exchange Rates:', exchangeRates);
    return exchangeRates; // Здесь будет массив данных типа ExchangeRate
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
}


// const [message, setMessage] = createSignal("qwe");
// createEffect(() => {
//   (async () => {
//     try {
//       const response = await invoke("set_use_external_api", {
//         useExternalApi: false,
//       });
//       setMessage(response as string);
//       console.log("External API set successfully");
//     } catch (error) {
//       console.error("Failed to set external API:", error);
//     }
//   })();
// });