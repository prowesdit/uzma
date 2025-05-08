import { formatDateToLocal } from "../utils";

export const PrintVoucher = ({ voucherData }: { voucherData: any }) => {
    
 

//   const handlePrint = () => {
//     const {
//       journalId,
//       officeName,
//       date,
//       createdBy,
//       createdAt,
//       editedBy,
//       editedAt,
//       description,
//       debitAccount,
//       creditAccount,
//       amount,
//     } = voucherData;

//     const uniqueTitle = `Debit_Voucher_${new Date().toISOString().replace(/[:.]/g, "-")}`;

//     const printWindow = window.open("", "", "width=800,height=600");
//     if (printWindow) {
//       printWindow.document.write(`

//        <html>
//   <head>
//     <title>${uniqueTitle}</title>
//     <style>
//       * {
//         margin: 0;
//         padding: 0;
//         box-sizing: border-box;
//       }

//       body {
//         font-family: "Helvetica Neue", Arial, sans-serif;
//         padding: 30px;
//         background-color: #fff;
//         color: #000;
//       }

//       #voucher {
//         max-width: 800px;
//         margin: auto;
//         padding: 30px;
//         border: 1px solid #ddd;
//         border-radius: 8px;
//         background-color: #ffffff;
//       }

//       .heading {
//         text-align: center;
//         font-size: 20px;
//         font-weight: bold;
//         margin-bottom: 20px;
//       }

//       .voucher-info {
//         margin-bottom: 20px;
//         font-size: 14px;
//       }

//       .voucher-info p {
//         margin: 2px 0;
//       }

//       table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-bottom: 20px;
//         font-size: 14px;
//       }

//       table,
//       th,
//       td {
//         border: 1px solid #000;
//       }

//       th,
//       td {
//         padding: 10px;
//         text-align: left;
//       }

//       .amount-summary td {
//         border: none;
//         padding-top: 10px;
//       }

//       .description-row td {
//         border-top: 1px solid #000;
//         padding-top: 10px;
//         font-style: italic;
//         text-align: left;
//       }

//       .footer-note {
//         font-size: 12px;
//         margin-top: 10px;
//         margin-bottom: 40px;
//         color: #555;
//       }

//       .signature-section {
//         margin-top: 40px;
//         display: flex;
//         justify-content: space-between;
//         font-size: 13px;
//       }

//       .signature-section div {
//         text-align: center;
//         width: 50%;
//       }

//       .signature-line {
//         margin-top: 40px;
//         border-top: 1px solid #000;
//         padding-top: 5px;
//       }

//       du {
//         text-decoration-line: underline;
//         text-decoration-style: double;
//       }
//     </style>
//   </head>
//   <body>
//     <div id="voucher">
//       <div class="heading">Debit Voucher of ${officeName}</div>

//       <div class="voucher-info">
//         <p><strong>Voucher No:</strong> ${journalId}</p>
//         <p><strong>Date:</strong> ${date}</p>
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>A/C</th>
//             <th>Dr</th>
//             <th>Cr</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>${debitAccount}</td>
//             <td>৳ ${(amount)}</td>
//             <td></td>
//           </tr>
//           <tr>
//             <td>${creditAccount}</td>
//             <td></td>
//             <td>৳ ${(amount)}</td>
//           </tr>
//           <tr class="amount-summary">
//             <td><strong>Amount</strong></td>
//             <td><du>৳ ${(amount)}</du></td>
//             <td><du>৳ ${(amount)}</du></td>
//           </tr>
//           <tr class="amount-summary">
//             <td><strong>(In words)</strong></td>
//             <td colspan="2">${(amount)} Taka.</td>
//           </tr>
//           <tr class="description-row">
//             <td colspan="3">Narration: ${description}</td>
//           </tr>
//         </tbody>
//       </table>

//       <div class="footer-note">
//         Trx-# ${journalId} transacted by ${createdBy} at ${formatDateToLocal(createdAt)}.
//         ${editedBy && editedAt ? `<br>Edited by ${editedBy} at ${formatDateToLocal(editedAt)}.` : ""}
//       </div>

//       <div class="signature-section">
//         <div>
//           <div class="signature-line">Prepared by</div>
//         </div>
//         <div>
//           <div class="signature-line">Received by</div>
//         </div>
//         <div>
//           <div class="signature-line">Checked by</div>
//         </div>
//         <div>
//           <div class="signature-line">Approved by</div>
//         </div>
//       </div>
//     </div>
//   </body>
// </html>



//       `);
//       printWindow.document.close();
//       printWindow.print();
//     } else {
//       console.error("Failed to open print window");
//     }

//     // Redirect after printing
//     // window.location.href = "/dashboard/transactions";
//   };

const handlePrint = () => {
    const {
      bookingNumber,
      customer,
      vehicle,
      driver,
      pickup_address,
      dropoff_address,
      pickup_dt,
      dropoff_dt,
      return_pickup_dt,
      return_dropoff_dt,
      passenger_num,
      payment_status,
      booking_status,
      booking_type,
      note,
      created_at,
    } = voucherData;
  
    const formattedDate = new Date(created_at).toLocaleDateString("bn-BD");
  
    const printWindow = window.open("", "", "width=900,height=650");
    const uniqueTitle = `Challan_${bookingNumber}_${new Date().toISOString().replace(/[:.]/g, "-")}`;
  
    if (printWindow) {
      printWindow.document.write(`
       <html>
    <head>
      <title>${uniqueTitle}</title>
      <style>
        body {
          font-family: "Siyam Rupali", Arial, sans-serif;
          margin: auto;
          font-size: 14px;
          /* width: 100%; */
          max-width: 800px;
          box-sizing: border-box;
          word-wrap: break-word;
        }
        .center {
          text-align: center;
        }
        .header {
          margin-bottom: 8px;
        }
        .agency-title {
          font-size: 18px;
          margin: 4px 0;
        }
        .agency-address {
          font-size: 13px;
          margin-bottom: 10px;
        }
        .voucher-meta {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 40px;
          margin-top: 12px;
          font-size: 14px;
        }
        .voucher-meta div {
          display: flex;
          justify-content: space-between;
          white-space: normal;
          word-break: break-word;
        }
        .voucher-meta-full {
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        .voucher-meta-full span {
          display: inline-block;
          width: 48%;
          word-break: break-word;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
          table-layout: fixed;
        }
        th, td {
          border: 1px solid #000;
          padding: 6px;
          text-align: center;
          word-wrap: break-word;
        }
        th:nth-child(1), td:nth-child(1) {
          width: 8%;
        }
        th:nth-child(2), td:nth-child(2) {
          width: 20%;
        }
        th:nth-child(3), td:nth-child(3) {
          width: 15%;
        }
        th:nth-child(4), td:nth-child(4) {
          width: 57%;
        }
        .note {
          margin-top: 14px;
          font-size: 13px;
          word-break: break-word;
        }
        .footer {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }
        .signature {
          text-align: center;
          margin-top: 30px;
        }
        .signature-line {
          margin-top: 30px;
          border-top: 1px solid #000;
          width: 120px;
          margin-left: auto;
          margin-right: 0;
        }
      </style>
    </head>
    <body>
      <div class="center header">
        <div style="font-size:13px;">বিসমিল্লাহির রাহমানির রাহিম</div>
        <div class="agency-title"><strong>উজ্মা ট্রান্সপোর্ট এজেন্সি</strong></div>
        <div class="agency-address">উত্তর সনিষপুর, ২নং ওয়ার্ড জাকরাবাদ, সীতাকুণ্ড, চট্টগ্রাম</div>
        <div style="margin-top: 6px;">বিষয়ঃ বিভিন্ন খরচ প্রসঙ্গে।</div>
      </div>

      <p style="margin-top: 10px;">বরাবর, হিসাব বিভাগ</p>
      <p>জনাব, যথাযথ সম্মান প্রদর্শন পূর্বক নিন্মে উল্লেখিত খরচের বিবরণগুলো যাচাই করে বিলটি অনুমোদন প্রদানের জন্য আবেদন জানানো যাচ্ছে।</p>

      <div class="voucher-meta">
        <div><span>ভাউচার নং:</span><span>${bookingNumber}</span></div>
        <div><span>তারিখ:</span><span>${formattedDate}</span></div>
        <div><span>গ্রাহক:</span><span>${customer}</span></div>
        <div><span>গাড়ি নং:</span><span>${vehicle}</span></div>
        <div><span>ড্রাইভার:</span><span>${driver}</span></div>
        <div><span>ভ্রমণকারীর সংখ্যা:</span><span>${passenger_num}</span></div>
        <div><span>ভাড়া ধরন:</span><span>${booking_type}</span></div>
      </div>

      <div class="voucher-meta-full">
        <span><strong>পিকআপ ঠিকানা:</strong> ${pickup_address}</span>
        <span><strong>ড্রপ-অফ ঠিকানা:</strong> ${dropoff_address}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>ক্রমিক নং</th>
            <th>বিবরণী</th>
            <th>টাকা</th>
            <th>মন্তব্য</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>জ্বালানী</td><td></td><td></td></tr>
          <tr><td>2</td><td>রিজভাড়া</td><td></td><td></td></tr>
          <tr><td>3</td><td>টোল-খাজনা</td><td></td><td></td></tr>
          <tr><td>4</td><td>পুলিশ</td><td></td><td></td></tr>
          <tr><td>5</td><td>কাস্টম</td><td></td><td></td></tr>
          <tr><td>6</td><td>বি.জি.বি</td><td></td><td></td></tr>
          <tr><td>7</td><td>অন্যান্য</td><td></td><td></td></tr>
          <tr><td>8</td><td>খোরাকি</td><td></td><td></td></tr>
          <tr><td>9</td><td></td><td></td><td></td></tr>
          <tr><td>10</td><td></td><td></td><td></td></tr>
          <tr><td>11</td><td></td><td></td><td></td></tr>
          <tr><td>12</td><td></td><td></td><td></td></tr>
          <tr>
            <td colspan="2"><strong>মোটঃ</strong></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="note"><strong>নোট:</strong> ${note || "N/A"}</div>

      <div class="footer">
        <div>তারিখঃ ${formattedDate}</div>
        <div class="signature">
          <div class="signature-line"></div>
          <div>নিবেদক</div>
        </div>
      </div>
    </body>
  </html>
      `);
  
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Print window could not be opened.");
    }
  };
  
  
  



  handlePrint();


};
