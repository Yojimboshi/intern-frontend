// src\views\apps\user\view\UserPaymentSetting.tsx
import { useState, useEffect, ChangeEvent } from 'react'
import {
  Box, Card, Grid, Table, Button, Dialog, Select,
  MenuItem, TableRow, TableCell, TableBody, TextField,
  CardHeader, Typography, InputLabel, CardContent,
  DialogTitle, FormControl, DialogContent, DialogActions,
  TableContainer, DialogContentText
} from '@mui/material';
import Payment from 'payment'
import Cards, { Focused } from 'react-credit-cards'
import CustomChip from 'src/@core/components/mui/chip'
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'
import { ThemeColor } from 'src/@core/layouts/types'
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'
import 'react-credit-cards/es/styles-compiled.css'
import Translations from 'src/layouts/components/Translations';
import axios from 'src/configs/axiosConfig';

interface DataType {
  cardName: string
  imgSrc: string
  imgAlt: string
  cardCvc: string
  expiryDate: string
  cardNumber: string
  cardStatus?: string
  badgeColor?: ThemeColor
}

const data: DataType[] = [
  {
    cardCvc: '587',
    cardName: 'Tom McBride',
    expiryDate: '12/24',
    imgAlt: 'Mastercard',
    badgeColor: 'primary',
    cardStatus: 'Popular',
    cardNumber: '5577 0000 5577 9865',
    imgSrc: '/images/logos/mastercard.png'
  }
]
interface CardDetails {
  id: number
  paymentMethod: 'CC' | 'Bank Account' | string
  cardNumber: string
  cardName: string
  expiryDate: string
  issueBank: string
  imgSrc: string
  imgAlt: string
  cardCvc: string
  cardStatus?: string
  badgeColor?: ThemeColor
}

interface BankDetails {
  id: number
  paymentMethod: 'CC' | 'Bank Account' | string
  fullName: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  swiftCode: string;
  billingAddress: string;
  contact: string;
  country: string;
  state: string;
  zipCode: string;
}

const getCardTypeImage = (cardNumber: string) => {
  const cardTypeImages: { [key: string]: string } = {
    '34': '/images/logos/american-express.png',
    '37': '/images/logos/american-express.png',
    '4': '/images/logos/visa.png',
    '51': '/images/logos/mastercard.png',
  };

  // Find the image path based on the BIN
  const imagePath = Object.keys(cardTypeImages).find((prefix) => cardNumber.startsWith(prefix));

  return imagePath ? cardTypeImages[imagePath] : '';
};

const UserPaymentSetting = () => {
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    id: 0,
    paymentMethod: 'CC',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    issueBank: '',
    imgSrc: '',
    imgAlt: '',
    cardCvc: '',
    cardStatus: undefined,
    badgeColor: undefined,
  });
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    id: 0,
    paymentMethod: 'Bank Account',
    fullName: '',
    bankName: '',
    accountNumber: '',
    accountType: '',
    swiftCode: '',
    billingAddress: '',
    contact: '',
    country: '',
    state: '',
    zipCode: '',
  });
  const [cardData, setCardData] = useState<CardDetails[]>([]);
  const [bankData, setBankData] = useState<BankDetails[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState<number | null>(null);
  const [paymentMethodUpdateCount, setPaymentMethodUpdateCount] = useState(0);
  const [dialogTitle, setDialogTitle] = useState('Add');
  const [openEditCard, setOpenEditCard] = useState(false);
  const [openBankDialog, setOpenBankDialog] = useState(false);
  const [focus, setFocus] = useState<Focused>()

  useEffect(() => {
    // Function to fetch payment methods data
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('/payments/payment-methods');
        const paymentMethods = response.data;

        // Assuming paymentMethods is an array of mixed payment methods
        const cards = paymentMethods.filter((item: CardDetails) => item.paymentMethod === 'CC');
        const banks = paymentMethods.filter((item: BankDetails) => item.paymentMethod === 'Bank Account');

        // Update states
        setCardData(cards);
        setBankData(banks);
      } catch (error) {
        console.error('Error fetching payment methods:', error);

        // Handle errors here, e.g., setting an error state, showing a message, etc.
      }
    };

    fetchPaymentMethods();
  }, [paymentMethodUpdateCount]);

  const handleOpenDialog = async (dialogType: 'card' | 'bank', edit = false, itemId: number | null = null) => {
    setEditMode(edit);
    setCurrentEditingId(itemId);

    // Fetch data first if editing
    if (edit && itemId != null) {
      try {
        const response = await axios.get(`/payments/payment-methods/${itemId}`);
        const data = response.data;

        // Now that data is fetched, set the state and open the dialog
        if (dialogType === 'card') {
          setCardDetails({
            ...data, // Ensure this spread matches the expected structure
          });
          setDialogTitle('Edit');
          setOpenEditCard(true);
        } else if (dialogType === 'bank') {
          setBankDetails({
            ...data, // Ensure this spread matches the expected structure
          });
          setDialogTitle('Edit');
          setOpenBankDialog(true);
        }
      } catch (error) {
        console.error(`Error fetching ${dialogType} details:`, error);
      }
    } else {
      // If not editing, just open the dialog for adding new item
      setDialogTitle('Add');
      if (dialogType === 'card') {
        setOpenEditCard(true);
      } else if (dialogType === 'bank') {
        setOpenBankDialog(true);
      }
    }
  };

  const addOrUpdatePaymentMethod = async (dialogType: 'CC' | 'Bank Account', isEdit: boolean, itemId: number | null) => {
    const endpoint = '/payments/payment-methods';
    const method = isEdit ? 'put' : 'post';
    const url = isEdit && itemId !== null ? `${endpoint}/${itemId}` : endpoint;

    // Determine which set of details to use based on dialogType
    const details = dialogType === 'CC' ? cardDetails : bankDetails;
    const data = { ...details };

    try {
      const response = await axios({ method, url, data, });
      console.log(`${dialogType} payment method added/updated:`, response.data);
      setPaymentMethodUpdateCount(count => count + 1);
      setOpenEditCard(false);
      setOpenBankDialog(false);
    } catch (error: any) {
      console.error(`Error in ${dialogType} payment method submission:`, error.response?.data || error.message);
    }
  };

  const handleCardSubmit = async () => {
    // Pass editMode and currentEditingId to the submit logic
    await addOrUpdatePaymentMethod('CC', editMode, currentEditingId);
  };

  const handleBankSubmit = async () => {
    // Pass editMode and currentEditingId to the submit logic
    await addOrUpdatePaymentMethod('Bank Account', editMode, currentEditingId);
  };

  const handleDeletePayment = async (paymentMethodId: number) => {
    const url = `/payments/payment-methods/${paymentMethodId}`;

    try {
      await axios.delete(url);

      // Filter out the deleted item from both card and bank data
      setCardData(prevCardData => prevCardData.filter(item => item.id !== paymentMethodId));
      setBankData(prevBankData => prevBankData.filter(item => item.id !== paymentMethodId));
    } catch (error: any) {
      console.error(`Error deleting payment method:`, error.response?.data || error.message);
    }
  };

  const handleBlur = () => setFocus(undefined)

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;

    let formattedName = name;
    if (name === 'number') {
      formattedName = 'cardNumber';
    } else if (name === 'expiry') {
      formattedName = 'expiryDate';
    } else if (name === 'cvc') {
      formattedName = 'cardCvc';
    }

    // For credit card inputs
    if (formattedName === 'cardNumber' || formattedName === 'expiryDate' || formattedName === 'cardCvc') {
      setCardDetails(prevState => ({
        ...prevState,
        [formattedName]: formattedName === 'cardNumber'
          ? formatCreditCardNumber(value, Payment) // Pass Payment object to the function
          : formattedName === 'expiryDate'
            ? formatExpirationDate(value) // No Payment object needed here
            : formattedName === 'cardCvc'
              ? formatCVC(value, prevState.cardNumber, Payment) // Pass Payment object to the function
              : value
      }));
    }

    else {
      setBankDetails(prevState => ({
        ...prevState,
        [formattedName]: value // Use formattedName here as well for consistency
      }));
    }
  };

  const handleEditCardClose = () => {
    setOpenEditCard(false);
    setCardDetails({
      id: 0,
      paymentMethod: '',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      issueBank: '',
      imgSrc: '',
      imgAlt: '',
      cardCvc: '',
      cardStatus: undefined,
      badgeColor: undefined,
    });
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={<Translations text='Payment Methods' />}
            action={
              <Button variant='contained' onClick={() => handleOpenDialog('card', false)}>
                <Translations text='Add Card' />
              </Button>
            }
          />
          <CardContent>
            {cardData.map((item: CardDetails, index: number) => (
              <Box
                key={index}
                sx={{
                  p: 5,
                  display: 'flex',
                  borderRadius: 1,
                  flexDirection: ['column', 'row'],
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: index !== data.length - 1 ? 4 : undefined,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}
              >
                <div>
                  <img
                    height='25'
                    alt='Card image'
                    src={getCardTypeImage(item.cardNumber)}
                  />
                  <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 500 }}>{item.cardName}</Typography>
                    {item.cardStatus && (
                      <CustomChip
                        skin='light'
                        size='small'
                        label={<Translations text={item.cardStatus} />}
                        color={item.badgeColor || 'default'}
                        sx={{ height: 20, ml: 2, fontSize: '0.75rem', fontWeight: 600, borderRadius: '5px' }}
                      />
                    )}
                  </Box>
                  <Typography variant='body2'>
                    **** **** **** {item.cardNumber ? item.cardNumber.slice(-4) : '----'}
                  </Typography>
                </div>
                <Box sx={{ mt: [3, 0], textAlign: ['start', 'end'] }}>
                  <Button variant='outlined' sx={{ mr: 3 }} onClick={() => handleOpenDialog('card', true, item.id)}>
                    <Translations text='Edit' />
                  </Button>
                  <Button variant='outlined' color='secondary' onClick={() => handleDeletePayment(item.id)}>
                    <Translations text='Delete' />
                  </Button>
                  <Typography variant='body2' sx={{ mt: 5 }}>
                    <Translations text='Card expires at' /> {item.expiryDate}
                  </Typography>
                </Box>
              </Box>
            ))}
          </CardContent>

          <Dialog
            open={openEditCard}
            onClose={handleEditCardClose}
            aria-labelledby='cc-edit-card'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
          >
            <DialogTitle id='cc-edit-card' sx={{ textAlign: 'center', fontSize: '1.5rem !important', m: 'auto' }}>
              <Translations text={`${dialogTitle.toLowerCase()} Card`} />
            </DialogTitle>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(5)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <DialogContentText
                variant='body2'
                id='cc-edit-card-description'
                sx={{ textAlign: 'center', mb: 7 }}
              >
                <Translations text={`${dialogTitle.toLowerCase()} below`} />
              </DialogContentText>
              <form>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <CardWrapper sx={{ '& .rccs': { m: '0 auto' } }}>
                      <Cards
                        cvc={cardDetails.cardCvc}
                        focused={focus}
                        expiry={cardDetails.expiryDate}
                        name={cardDetails.cardName}
                        number={cardDetails.cardNumber}
                      />
                    </CardWrapper>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name='number'
                          value={cardDetails.cardNumber}
                          autoComplete='off'
                          label='Card Number'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          placeholder='0000 0000 0000 0000'
                          onFocus={e => setFocus(e.target.name as Focused)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          name='name'
                          value={cardDetails.cardName}
                          autoComplete='off'
                          label='Name on Card'
                          placeholder='John Doe'
                          onChange={e => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                          onFocus={e => setFocus(e.target.name as Focused)}
                          onBlur={handleBlur}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          name='expiry'
                          label='Expiry'
                          value={cardDetails.expiryDate}
                          placeholder='MM/YY'
                          onChange={handleInputChange}
                          onFocus={e => setFocus(e.target.name as Focused)}
                          onBlur={handleBlur}
                          inputProps={{ maxLength: 5 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <FormControl fullWidth>
                          <InputLabel id='cc-edit-card-status-label'>Card Status</InputLabel>
                          <Select
                            label='Card Status'
                            id='cc-edit-card-status'
                            labelId='cc-edit-card-status-label'
                            value={cardDetails.cardStatus} // Assuming issueBank holds the card status
                            onChange={e => setCardDetails({ ...cardDetails, cardStatus: e.target.value as string })}
                          >
                            <MenuItem value='Primary'>Primary</MenuItem>
                            <MenuItem value='Expired'>Expired</MenuItem>
                            <MenuItem value='Active'>Active</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          name='cvc'
                          label='CVC'
                          value={cardDetails.cardCvc}
                          autoComplete='off'
                          placeholder={Payment.fns.cardType(cardDetails.cardNumber) === 'amex' ? '1234' : '123'}
                          onChange={handleInputChange}
                          onFocus={e => setFocus(e.target.name as Focused)}
                          onBlur={handleBlur}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleCardSubmit}>
                <Translations text='submit' />
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleEditCardClose}>
                <Translations text='cancel' />
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={<Translations text='Bank Account' />}
            action={
              <Button variant='contained' onClick={() => handleOpenDialog('bank', false)}>
                <Translations text='Add Account' />
              </Button>
            }
          />
          <CardContent>
            {bankData.map((item: BankDetails, index: number) => (
              <Box
                key={item.id} // Use a unique identifier from your item, not the index
                sx={{
                  p: 5,
                  display: 'flex',
                  borderRadius: 1,
                  flexDirection: 'column',
                  mb: index !== bankData.length - 1 ? 4 : undefined,
                  border: theme => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} lg={6}>
                      <TableContainer>
                        <Table size='small' sx={{ width: '95%' }}>
                          <TableBody
                            sx={{
                              '& .MuiTableCell-root': {
                                border: 0,
                                pt: 2,
                                pb: 2,
                                pl: '0 !important',
                                pr: '0 !important',
                                '&:first-of-type': {
                                  width: 148
                                }
                              }
                            }}
                          >
                            <TableRow>
                              <TableCell>
                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                  <Translations text='Full Name' />
                                </Typography>
                              </TableCell>
                              <TableCell>{item.fullName}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                  <Translations text='Bank Name' />
                                </Typography>
                              </TableCell>
                              <TableCell>{item.bankName}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                  <Translations text='Account Number' />
                                </Typography>
                              </TableCell>
                              <TableCell>{item.accountNumber}</TableCell>
                            </TableRow>

                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    <Grid item xs={12} lg={6}>
                      <TableContainer>
                        <Table size='small'>
                          <TableBody
                            sx={{
                              '& .MuiTableCell-root': {
                                border: 0,
                                pt: 2,
                                pb: 2,
                                pl: '0 !important',
                                pr: '0 !important',
                                '&:first-of-type': {
                                  width: 148
                                }
                              }
                            }}
                          >
                            <TableRow>
                              <TableCell>
                                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                  <Translations text='Country' />
                                </Typography>
                              </TableCell>
                              <TableCell>{item.country}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button variant='outlined' onClick={() => handleOpenDialog('bank', true, item.id)}>
                    <Translations text='Edit' />
                  </Button>
                  <Button variant='outlined' color='secondary' onClick={() => handleDeletePayment(item.id)}>
                    <Translations text='Delete' />
                  </Button>
                </Box>
              </Box>
            ))}
          </CardContent>
          <Dialog
            open={openBankDialog}
            onClose={() => setOpenBankDialog(false)}
            aria-labelledby='user-address-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
          >
            <DialogTitle id='user-address-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
              Account Detail
            </DialogTitle>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <DialogContentText variant='body2' id='user-address-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                Edit Account details
              </DialogContentText>
              <form>
                <Grid container spacing={6}>
                  {/* Full Name Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Full Name'
                      value={bankDetails.fullName}
                      onChange={e => setBankDetails({ ...bankDetails, fullName: e.target.value })}
                    />
                  </Grid>

                  {/* Bank Name Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Bank Name'
                      value={bankDetails.bankName}
                      onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    />
                  </Grid>

                  {/* Account Number Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Account Number'
                      value={bankDetails.accountNumber}
                      onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    />
                  </Grid>

                  {/* Account Type Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Account Type'
                      value={bankDetails.accountType}
                      onChange={e => setBankDetails({ ...bankDetails, accountType: e.target.value })}
                    />
                  </Grid>

                  {/* SWIFT Code Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='SWIFT Code'
                      value={bankDetails.swiftCode}
                      onChange={e => setBankDetails({ ...bankDetails, swiftCode: e.target.value })}
                    />
                  </Grid>

                  {/* Billing Address Field */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      label='Billing Address'
                      value={bankDetails.billingAddress}
                      onChange={e => setBankDetails({ ...bankDetails, billingAddress: e.target.value })}
                    />
                  </Grid>

                  {/* Contact Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Contact'
                      value={bankDetails.contact}
                      onChange={e => setBankDetails({ ...bankDetails, contact: e.target.value })}
                    />
                  </Grid>

                  {/* Country Field - Assuming it's a Select dropdown */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Country'
                      value={bankDetails.country}
                      onChange={e => setBankDetails({ ...bankDetails, country: e.target.value })}
                    />
                  </Grid>

                </Grid>
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleBankSubmit}>
                <Translations text='Submit' />
              </Button>
              <Button variant='outlined' color='secondary' onClick={() => setOpenBankDialog(false)}>
                <Translations text='Cancel' />
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserPaymentSetting
