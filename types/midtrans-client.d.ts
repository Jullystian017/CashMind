declare module "midtrans-client" {
  interface SnapOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CustomerDetails {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }

  interface ItemDetail {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }

  interface TransactionParameter {
    transaction_details: TransactionDetails;
    customer_details?: CustomerDetails;
    item_details?: ItemDetail[];
  }

  interface TransactionResult {
    token: string;
    redirect_url: string;
  }

  class Snap {
    constructor(options: SnapOptions);
    createTransaction(
      parameter: TransactionParameter
    ): Promise<TransactionResult>;
  }

  interface TransactionStatusResponse {
    transaction_status: string;
    fraud_status: string;
    transaction_id: string;
    payment_type: string;
    [key: string]: any;
  }

  class CoreApi {
    constructor(options: SnapOptions);
    transaction: {
      status(orderId: string): Promise<TransactionStatusResponse>;
    };
  }

  export default { Snap, CoreApi };
  export { Snap, CoreApi };
}
