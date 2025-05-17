"use client";
import React, { useEffect, useState } from "react";

interface InvoiceItem {
  barcode: string;
  productName: string;
  quantity: number;
  discount: number;
  unitPrice: string;
  lineTotalNet: string;
}

export default function InvoiceDetail() {
  const [invoiceImg, setInvoiceImg] = useState<any>("");
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [supperMarketName, setSupperMarketName] = useState<string>();
  const [productItems, setProductItems] = useState<InvoiceItem[]>([]);

  const defaultImageUrl = "image_placeholder.png";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem("imgData");
      setInvoiceImg(data);
    }

    let invoiceJsonData = JSON.parse(
      sessionStorage.getItem("invoice_data")?.toString() ?? "{}"
    );

    console.log(invoiceJsonData);

    setTotalQuantity(invoiceJsonData.total_quantity);
    setTotal(invoiceJsonData.grand_total);

    let dataItems = invoiceJsonData.items;

    let items = dataItems.map((el: any) => {
      return {
        barcode: el.code,
        productName: el.name,
        quantity: el.quantity,
        discount: el.discount,
        unitPrice: el.unit_price,
        lineTotalNet: el.total_price,
      };
    });

    console.log(items);

    setProductItems(items);
    setSupperMarketName(invoiceJsonData.supermarket_name);
  }, []);

  return (
    <div className="h-screen ph-[2dvh] flex items-start justify-center">
      {/* Container with fixed height and no overflow on left */}
      <div className="h-screen w-[90dvw] flex flex-col md:flex-row md:space-x-[2dvw] space-y-6 md:space-y-0 overflow-hidden">
        {/* Left: Image stays static */}
        <div className="h-[100dvh] flex items-center justify-center">
          <div className="w-[80vh] max-w-4xl h-[80vh] flex items-center justify-center bg-white rounded-lg overflow-hidden">
            {/* {defaultImageUrl} */}
            <img
              src={invoiceImg ? invoiceImg : defaultImageUrl}
              alt="Invoice"
              className="object-contain max-w-full max-h-full"
            />
          </div>
        </div>

        {/* Right: Scrollable content */}
        <div className="w-full md:w-1/2 flex flex-col space-y-6 overflow-y-auto h-full pr-2 pt-[2dvh]">
          <h2 className="text-2xl font-bold">Invoice Details</h2>

          <h3 className="text-xl text-center font-bold mb-4">
            {supperMarketName}
          </h3>

          {/* Items List */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1 text-left text-sm">
                    Barcode
                  </th>
                  <th className="border px-2 py-1 text-left text-sm">
                    Product Name
                  </th>
                  <th className="border px-2 py-1 text-right text-sm">
                    Unit Price
                  </th>
                  <th className="border px-2 py-1 text-right text-sm">Qty</th>

                  <th className="border px-2 py-1 text-right text-sm">
                    Discount
                  </th>

                  <th className="border px-2 py-1 text-right text-sm">
                    Line Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {productItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border px-2 py-1 text-sm">{item.barcode}</td>
                    <td className="border px-2 py-1 text-sm">
                      {item.productName}
                    </td>
                    <td className="border px-2 py-1 text-right text-sm">
                      {item.unitPrice == null ? "N/A" : item.unitPrice}
                    </td>
                    <td className="border px-2 py-1 text-right text-sm">
                      {item.quantity == null ? "N/A" : item.quantity}
                    </td>

                    <td className="border px-2 py-1 text-right text-sm">
                      {item.discount == null ? "N/A" : item.discount}
                    </td>

                    <td className="border px-2 py-1 text-right text-sm">
                      {item.lineTotalNet == null ? "N/A" : item.unitPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Fields */}
          <div className="flex justify-between pt-4 border-t">
            <p className="text-sm">Total Qty: {totalQuantity}</p>
            <p className="text-sm">Total Net: {total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
