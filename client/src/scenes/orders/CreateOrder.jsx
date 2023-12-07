import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTransactionMutation } from 'state/api';
import DraftForm from 'components/transactions/draft/DraftForm';
import { getLoggedInUser } from 'utils/token';

const CreateOrder = () => {
  const navigate = useNavigate();
  const user = getLoggedInUser();
  const [createTransaction] = useCreateTransactionMutation();

  const [formValues, setFormValues] = useState({
    client: '',
    initialDate: null,
    expiryDate: null,
  });

  const [items, setItems] = useState([{ name: '', description: '', quantity: 1, price: 0 }]);

  const handleSubmit = async (formValues, items) => {
    console.log("Form Values at handleSubmit:", formValues); 
    console.log("Items at handleSubmit:", items); 

    const transactionData = {
      buyerId: user.id,
      sellerId: user.id,
      products: items,
      cost: items.reduce((total, item) => total + (item.price * item.quantity), 0),
      initialDate: formValues.initialDate,
      expiryDate: formValues.expiryDate,
    };

    try {
      const response = await createTransaction(transactionData).unwrap();
      if (response)
        navigate('/orders');
    } catch (error) {
      console.log("Error during transaction creation: ", error);
    }
  };

  return (
    <DraftForm
      formValues={formValues}
      setFormValues={setFormValues}
      items={items}
      setItems={setItems}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateOrder;
