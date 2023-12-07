import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useViewTransactionQuery, useUpdateTransactionMutation } from 'state/api';
import DraftForm from 'components/transactions/draft/DraftForm';
import PageLoader from 'components/PageLoader';

const UpdateOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: transactionData, isLoading: isLoadingTransaction } = useViewTransactionQuery(id);
  const [updateTransaction] = useUpdateTransactionMutation();

  const [formValues, setFormValues] = useState({
    client: '',
    initialDate: null,
    expiryDate: null,
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (transactionData) {
      setFormValues({
        client: transactionData.sellerId,
        initialDate: transactionData.initialDate,
        expiryDate: transactionData.expiryDate,
      });
      setItems(Array.isArray(transactionData.products) ? transactionData.products : []);
    }
  }, [transactionData]);

  const handleSubmit = async (formValues, items) => {
    console.log("Form Values at handleSubmit:", formValues); 
    console.log("Items at handleSubmit: ", items);
    const updateData = {
      products: items.map(item => {
        const productData = {
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
        };

        if (item._id) 
          productData._id = item._id;

        return productData;
      }),
      cost: items.reduce((total, item) => total + (item.price * item.quantity), 0),
    };
    try {
      const response = await updateTransaction({ id: id, ...updateData }).unwrap();
      if (response)
        navigate('/orders');
    } catch (error) {
      console.log("Error during transaction update: ", error);
    }
  };

  if (isLoadingTransaction) {
    return <PageLoader />;
  }

  return (
    <DraftForm
      isUpdate={true}
      transactionId={transactionData._id}
      status={transactionData.status}
      formValues={formValues}
      setFormValues={setFormValues}
      items={items}
      setItems={setItems}
      onSubmit={handleSubmit}
    />
  );
};

export default UpdateOrder;
