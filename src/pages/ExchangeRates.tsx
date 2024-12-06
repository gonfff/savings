import { TableHamburgerButton } from "../components/Buttons.tsx";
import { fetchExchangeRates } from "../services/ExchangeRates.ts";

const ExchangeRates = () => {
  return (
    <div class="flex flex-col">
      <h1 class="text-2xl font-bold text-center">ExchangeRates Screen</h1>
      <ExchangeRatesTable />
    </div>
  );
};

export default ExchangeRates;

const ExchangeRatesTable = () => {
  return <ExchangeRatesTableHead />;
};

const ExchangeRatesTableHead = () => {
  return (
    <div class="h-screen overflow-y-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Target</th>
            <th>Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <ExchangeRatesTableData />
        </tbody>
      </table>
    </div>
  );
};

const ExchangeRatesTableData = () => {
  fetchExchangeRates();
  return (
    <>
      <tr>
        <th>1</th>
        <td>Cy Ganderton</td>
        <td>Quality Control Specialist</td>
        <td>Blue</td>
        <td>
          <TableHamburgerButton />
        </td>
      </tr>
    </>
  );
};

// const ExchangeRatesTableData = () => {
//   return (
//     <>
//       <tr>
//         <th>1</th>
//         <td>Cy Ganderton</td>
//         <td>Quality Control Specialist</td>
//         <td>Blue</td>
//       </tr>
//       <tr>
//         <th>2</th>
//         <td>Hart Hagerty</td>
//         <td>Desktop Support Technician</td>
//         <td>Purple</td>
//       </tr>
//       <tr>
//         <th>3</th>
//         <td>Brice Swyre</td>
//         <td>Tax Accountant</td>
//         <td>Red</td>
//       </tr>
//       <tr>
//         <th>3</th>
//         <td>Brice Swyre</td>
//         <td>Tax Accountant</td>
//         <td>Red</td>
//       </tr>
//       <tr>
//         <th>3</th>
//         <td>Brice Swyre</td>
//         <td>Tax Accountant</td>
//         <td>Red</td>
//       </tr>
//       <tr>
//         <th>3</th>
//         <td>Brice Swyre</td>
//         <td>Tax Accountant</td>
//         <td>Red</td>
//       </tr>
//       <tr>
//         <th>3</th>
//         <td>Brice Swyre</td>
//         <td>Tax Accountant</td>
//         <td>Red</td>
//       </tr>
//       <tr>
//         <th>3</th>
//         <td>Brice Swyre</td>
//         <td>Tax Accountant</td>
//         <td>Red</td>
//       </tr>
//       <tr>
//         <th>3</th>
//         <td>Brice Swyre</td>
//         <td>Tax Accountant</td>
//         <td>Red</td>
//       </tr>
//       <tr>
//         <th>3</th>
//         <td>Brice Swyre</td>
//         <td>Tax Accountant</td>
//         <td>Red</td>
//       </tr>
//       <tr>
//         <th>3</th>
//         <td>Brice Swyre</td>
//         <td>Tax Accountant</td>
//         <td>Red</td>
//       </tr>
//       <tr>
//         <th>3</th>
//         <td>Brice Swyre</td>
//         <td>Tax Accountant</td>
//         <td>Red</td>
//       </tr>
//       <tr>
//         <th>3</th>
//         <td>Brice Swyre</td>
//         <td>Tax Accountant</td>
//         <td>Red</td>
//       </tr>
//     </>
//   );
// };
