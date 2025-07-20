import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { personOperations, personFields } from './PersonDescription';
import { companyOperations, companyFields } from './CompanyDescription';
import { dealOperations, dealFields } from './DealDescription';
import { dealItemOperations, dealItemFields } from './DealItemDescription';
import { phoneOperations, phoneFields } from './PhoneDescription';
import { emailOperations, emailFields } from './EmailDescription';
import { addressOperations, addressFields } from './AddressDescription';
import { noteOperations, noteFields } from './NoteDescription';
import { taskOperations, taskFields } from './TaskDescription';
import { productOperations, productFields } from './ProductDescription';
import { productCategoryOperations, productCategoryFields } from './ProductCategoryDescription';
import { fileOperations, fileFields } from './FileDescription';
import { customRecordOperations, customRecordFields } from './CustomRecordDescription';
import { createPerson, getPerson, getPersons, updatePerson, deletePerson } from './PersonOperations';
import { createCompany, getCompany, getCompanies, updateCompany, deleteCompany } from './CompanyOperations';
import { createDeal, getDeal, getDeals, updateDeal, deleteDeal } from './DealOperations';
import { createDealItem, getDealItem, getDealItems, updateDealItem, deleteDealItem } from './DealItemOperations';
import { createPhone, getPhone, getPhones, updatePhone, deletePhone } from './PhoneOperations';
import { createEmail, getEmail, getEmails, updateEmail, deleteEmail } from './EmailOperations';
import { createAddress, getAddress, getAddresses, updateAddress, deleteAddress } from './AddressOperations';
import { createNote, getNote, getNotes, updateNote, deleteNote } from './NoteOperations';
import { createTask, getTask, getTasks, updateTask, deleteTask } from './TaskOperations';
import { createProduct, getProduct, getProducts, updateProduct, deleteProduct } from './ProductOperations';
import { createProductCategory, getProductCategory, getProductCategories as getProductCategoriesOperation, updateProductCategory, deleteProductCategory } from './ProductCategoryOperations';
import { getFile, getFiles, deleteFile } from './FileOperations';
import { createCustomRecord, getCustomRecord, getCustomRecords, updateCustomRecord, deleteCustomRecord } from './CustomRecordOperations';
import { getPersonCustomFields, getCompanyCustomFields, getDealCustomFields, getTaskTypes, getPipelines, getPipelineSteps, getDealPipelineSteps, getProductOptions, getProductCategories, getUserOptions, getTeamOptions, getCustomRecordDefinitions, getCustomRecordCustomFields } from './loadOptions';

export class Arivo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Arivo',
		name: 'arivo',
		icon: 'file:arivo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Create and edit data in Arivo CRM',
		defaults: {
			name: 'Arivo',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'arivoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Address',
						value: 'address',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Custom Record',
						value: 'customRecord',
					},
					{
						name: 'Deal',
						value: 'deal',
					},
					{
						name: 'Deal Item',
						value: 'dealItem',
					},
					{
						name: 'Email',
						value: 'email',
					},
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'Note',
						value: 'note',
					},
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Phone',
						value: 'phone',
					},
					{
						name: 'Product',
						value: 'product',
					},
					{
						name: 'Product Category',
						value: 'productCategory',
					},
					{
						name: 'Task',
						value: 'task',
					},
				],
				default: 'person',
			},
			...taskOperations,
			...taskFields,
			...companyOperations,
			...companyFields,
			...customRecordOperations,
			...customRecordFields,
			...dealOperations,
			...dealFields,
			...dealItemOperations,
			...dealItemFields,
			...phoneOperations,
			...phoneFields,
			...emailOperations,
			...emailFields,
			...fileOperations,
			...fileFields,
			...addressOperations,
			...addressFields,
			...noteOperations,
			...noteFields,
			...personOperations,
			...personFields,
			...productOperations,
			...productFields,
			...productCategoryOperations,
			...productCategoryFields,
		],
	};

	methods = {
		loadOptions: {
			getTaskTypes,
			getCompanyCustomFields,
			getDealCustomFields,
			getPersonCustomFields,
			getCustomRecordDefinitions,
			getCustomRecordCustomFields,
			getPipelines,
			getPipelineSteps,
			getDealPipelineSteps,
			getProducts: getProductOptions,
			getProductCategories,
			getUserOptions: getUserOptions,
			getTeamOptions,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'person') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createPerson.call(this, i);
					} else if (operation === 'delete') {
						response = await deletePerson.call(this, i);
					} else if (operation === 'get') {
						response = await getPerson.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getPersons.call(this, i);
						for (const person of responseArray) {
							returnData.push({ json: person, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updatePerson.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'company') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createCompany.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteCompany.call(this, i);
					} else if (operation === 'get') {
						response = await getCompany.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getCompanies.call(this, i);
						for (const company of responseArray) {
							returnData.push({ json: company, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateCompany.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'customRecord') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createCustomRecord.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteCustomRecord.call(this, i);
					} else if (operation === 'get') {
						response = await getCustomRecord.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getCustomRecords.call(this, i);
						for (const customRecord of responseArray) {
							returnData.push({ json: customRecord, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateCustomRecord.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'deal') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createDeal.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteDeal.call(this, i);
					} else if (operation === 'get') {
						response = await getDeal.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getDeals.call(this, i);
						for (const deal of responseArray) {
							returnData.push({ json: deal, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateDeal.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'dealItem') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createDealItem.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteDealItem.call(this, i);
					} else if (operation === 'get') {
						response = await getDealItem.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getDealItems.call(this, i);
						for (const dealItem of responseArray) {
							returnData.push({ json: dealItem, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateDealItem.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'phone') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createPhone.call(this, i);
					} else if (operation === 'delete') {
						response = await deletePhone.call(this, i);
					} else if (operation === 'get') {
						response = await getPhone.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getPhones.call(this, i);
						for (const phone of responseArray) {
							returnData.push({ json: phone, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updatePhone.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'email') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createEmail.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteEmail.call(this, i);
					} else if (operation === 'get') {
						response = await getEmail.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getEmails.call(this, i);
						for (const email of responseArray) {
							returnData.push({ json: email, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateEmail.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'file') {
					let response: IDataObject = {};
					if (operation === 'delete') {
						response = await deleteFile.call(this, i);
					} else if (operation === 'get') {
						response = await getFile.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getFiles.call(this, i);
						for (const file of responseArray) {
							returnData.push({ json: file, pairedItem: { item: i } });
						}
						continue;
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'address') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createAddress.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteAddress.call(this, i);
					} else if (operation === 'get') {
						response = await getAddress.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getAddresses.call(this, i);
						for (const address of responseArray) {
							returnData.push({ json: address, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateAddress.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'note') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createNote.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteNote.call(this, i);
					} else if (operation === 'get') {
						response = await getNote.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getNotes.call(this, i);
						for (const note of responseArray) {
							returnData.push({ json: note, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateNote.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'task') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createTask.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteTask.call(this, i);
					} else if (operation === 'get') {
						response = await getTask.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getTasks.call(this, i);
						for (const task of responseArray) {
							returnData.push({ json: task, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateTask.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'product') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createProduct.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteProduct.call(this, i);
					} else if (operation === 'get') {
						response = await getProduct.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getProducts.call(this, i);
						for (const product of responseArray) {
							returnData.push({ json: product, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateProduct.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				} else if (resource === 'productCategory') {
					let response: IDataObject = {};
					if (operation === 'create') {
						response = await createProductCategory.call(this, i);
					} else if (operation === 'delete') {
						response = await deleteProductCategory.call(this, i);
					} else if (operation === 'get') {
						response = await getProductCategory.call(this, i);
					} else if (operation === 'getMany') {
						const responseArray = await getProductCategoriesOperation.call(this, i);
						for (const productCategory of responseArray) {
							returnData.push({ json: productCategory, pairedItem: { item: i } });
						}
						continue;
					} else if (operation === 'update') {
						response = await updateProductCategory.call(this, i);
					}
					returnData.push({ json: response, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
} 