import { LightningElement, api, track, wire } from 'lwc';
import manageNotificationController from '@salesforce/apex/ManageNotificationController.manageNotificationController';
import FILE_ICON from '@salesforce/resourceUrl/fileUploadIcon';
import DOWNLOAD_ICON from '@salesforce/resourceUrl/downloadIcon';
import TEXT_ICON from '@salesforce/resourceUrl/textIcon';
import DELETE_ICON from '@salesforce/resourceUrl/deleteIcon';
import NOTIFICATION_ICON from '@salesforce/resourceUrl/notificationIcon';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import getMileage from '@salesforce/apex/ManageNotificationController.ImportMileage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendAllInsuranceEmail from '@salesforce/apex/ManageNotificationController.sendAllInsuranceEmail';
import readFromFileInchunk from '@salesforce/apex/ManageNotificationController.readFromFileInchunk';
import UploadLocation from '@salesforce/apex/ManageNotificationController.UploadLocation';
import editInlineNewEmployee from '@salesforce/apex/ManageNotificationController.editInlineNewEmployee';
import sendMessageToMultipleContacts from '@salesforce/apex/ManageNotificationController.sendMessageToMultipleContacts';
import sendImageToMultipleContacts from '@salesforce/apex/ManageNotificationController.sendImageToMultipleContacts';
import clearMassNotification from '@salesforce/apex/ManageNotificationController.clearMassNotification';
import UpdateImportMileage from '@salesforce/apex/ManageNotificationController.UpdateImportMileage';
import clearNotification from '@salesforce/apex/ManageNotificationController.clearNotification';
import WORK_BOOK from "@salesforce/resourceUrl/xlsx";
import { publish, MessageContext } from 'lightning/messageService';
import MESSAGE_CHANNEL from '@salesforce/messageChannel/redirectChannel__c';

import {
  toastEvents, modalEvents
} from 'c/utils';
import {
  loadStyle,
  loadScript
} from 'lightning/platformResourceLoader';

export default class UserTools extends LightningElement {

  @api contactList;
  @api contactInfo;
  @api accountId;
  @api contactId;
  @api tripColumn;
  @api tripKeyFields;
  @track isModalOpen = false;
  sortable = true;
  isFalse = true;
  isRecord = false;
  modalKeyFields;
  modalListColumn;
  isScrollable = false;
  isNotCustomSettingMessage = true;
  isSort = true;
  isRowDn = true;
  isScrollable = false;
  paginated = false;
  data = [];
  accordionKeyFields;
  isPayperiod = false;
  textMessaging = false;
  name;
  dataList = [];
  isdataLoaded = false;
  @api accordionKeyFields = ["fullname", "insurance", "insuranceFile", "expirationDate", "locationFile", "notiMessage", "messageHolder"];
  accordionList = [];
  @api fileIconUrl = `${FILE_ICON}#file`;
  @api downloadIconUrl = `${DOWNLOAD_ICON}#download`;
  @api textIconUrl = `${TEXT_ICON}#text`;
  @api notificationIconUrl = `${NOTIFICATION_ICON}#notification`;
  @api deleteIconUrl = `${DELETE_ICON}#delete`;
  @api isSubmitVisible = false;
  fileData;
  isNotification = false;
  locationAttachment;
  isSearchEnable = true;
  @wire(MessageContext) messageContext;
  sortCol = false;
  @api accordionListColumn = [
    {
      "id": 1,
      "name": "Name",
      "colName": "fullname",
      "colType": "String",
      "style": "width:12rem",
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 2,
      "name": "Insurance Status",
      "colName": "insurance",
      "colType": "String",
      "style": "width:12rem",
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 3,
      "name": "Insurance",
      "colName": "insuranceFile",
      "colType": "String",
      "sort": true,
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 4,
      "name": "Expires",
      "colName": "expirationDate",
      "colType": "Date",
      "sort": true,
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 5,
      "name": "Location",
      "colName": "locationFile",
      "colType": "String",
      "sort": true,
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 6,
      "name": "Notification Message",
      "colName": "notiMessage",
      "colType": "String",
      "style": "width:15rem",
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 7,
      "name": "Message",
      "colName": "messageHolder",
      "colType": "String",
      "sort": true,
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    }
  ];

  @api recordId;
  @api classToTable = 'slds-table--header-fixed_container preview-height';
  searchIcon = resourceImage + '/mburse/assets/mBurse-Icons/Vector.png';
  currentPageReference = null;
  urlStateParameters = null;
  headerModalText = "Communication";
  contentMessage = "Communication";
  subMessage = "body Content";
  modalcontentstyle = "slds-modal__content slds-p-left_medium slds-p-right_medium slds-p-bottom_medium slds-p-top_small overflow-visible"
  modalClass = "slds-modal slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft";
  headerClass = "slds-modal__header header-preview slds-p-left_xx-large slds-clearfix";
  subheaderClass = "slds-modal__title slds-hyphenate hedear-style_class";
  modalContent = "slds-modal__content slds-p-left_medium slds-p-right_medium slds-p-bottom_medium slds-p-top_small";
  styleHeader = "slds-modal__container modal--small";
  closebtnclass = "close-notify";
  isCheckbox = true;
  onloadTool;
  istrueInsurance = false;
  isMileageLoaded = false;
  mileageData;
  mileageListColumn;
  @api isEditMode = false;
  @api editableView;
  istrueMessaging = false;
  locationData;
  mileageKeyFields;
  insuranceLabel = 'Send Insurance Reminder';
  selectedData;
  disableBtn = true;
  isTrueCancelProcess = false;
  messagingLabel = 'Mass Text Message';
  massNotimessageLabel = 'Mass Notification Message';
  fileKey;
  fileContent;
  fileId;
  pdfContent;
  choosefile;
  fileList;
  chooseFileName;
  errorUploading;
  fileName;
  fSize;
  attachmentName;
  attachment;
  positionIndex;
  fileSize;
  chunkSize = 950000;
  isSpinner = false;
  onmassText = false;
  onnotificationMessage = false;
  items = [];
  userName;
  msgIndex = "";
  notificationDate = "";
  driverId;
  locationChoose = [];
  notiTextMessage = "";
  massTextMessage;
  massNotificationMsg = "";
  attachUrl = "";
  notificationObj = {};
  insuranceObj = {};
  imageUploaded = false;
  insertedText = false;
  mileageupdate;
  fileInputRef;
  fileResult;
  file;
  pdfUploaded = false;
  checkAll = false;
  _value = '';
  
  get classForFile() {
    return (this.imageUploaded) ? 'chat__file-image chat_background' : 'chat__file-image'
  }
  get textStyle() {
    return (this.imageUploaded) ? 'slds-col slds-size_1-of-1 slds-medium-size_6-of-12 slds-large-size_6-of-12 slds-p-right_medium' : 'slds-col slds-size_1-of-1 slds-medium-size_6-of-12 slds-large-size_9-of-12 slds-p-right_medium'
  }
  get imageHolderStyle() {
    return (this.imageUploaded) ? 'slds-col slds-size_1-of-1 slds-medium-size_6-of-12 slds-large-size_4-of-12 slds-p-right_xxx-small' : 'slds-col slds-size_1-of-1 slds-medium-size_6-of-12 slds-large-size_1-of-12 slds-p-right_xxx-small'
  }
 
  @api closeChildDialog(){
    this.textMessaging = false;
    this.isNotification = false;
  }

  openMenu() {
    this.styleheader = "slds-modal__container slds-m-top_medium modal_width"
    if (this.template.querySelector('c-user-profile-modal')) {
      if (this.isMileageLoaded) {
        const evt = new ShowToastEvent({
          title: 'Toast Info',
          message: 'Cancel the existing process first to access the menu',
          variant: 'info',
          mode: 'dismissable'
        });
        this.dispatchEvent(evt);
      } else {
        this.template.querySelector('c-user-profile-modal[data-id="menu"]').show();
      }
    }
  }
  //Function to redirect user details page with editable mode
  editRecord(event){
    event.preventDefault();
    const id = event.detail;
    const message = {
      recordId: id,
      messageText: 'Message channel Sender!'
    };
    publish(this.messageContext, MESSAGE_CHANNEL, message);
    const selectEvent = new CustomEvent('userpreview', {
      detail: id
      });
    this.dispatchEvent(selectEvent);
  }
  handleModal(event) {
    this.fileKey = event.detail.key;
    this.fileId = event.detail.id;
    if (this.fileKey == 'locationFile' || this.fileKey == 'insuranceFile') {
      const fileInput = this.template.querySelector('input[type="file"]');
      fileInput.click();
    } else {
    }
  }
  renderedCallback() {
    if (this.renderInitialized) {
        return;
    }
    this.renderInitialized = true;
    Promise.all([loadScript(this, WORK_BOOK)])
      .then(() => {
        console.log("success");
      })
      .catch(error => {
        console.log("failure");
      });
  }
  initializeTooltip() {
    $(this.template.querySelector('.naoTooltip-wrap')).naoTooltip();
    $(this.template.querySelector('.naoTooltip-wrap')).naoTooltip({
        speed: 200
    });
  }
  getUser(id) {
		let list = this.proxyToObject(this.data);
		return list.find(user => (user.contactId === id));
	}
  //Here we can handle single notification message and text message
  handlePopup(event) {
    if (event && event.detail) {
      let key = event.detail.key;
      let id = event.detail.id;
      let singleUser = this.getUser(id);
      this.notificationObj = singleUser;
      this.userName = singleUser.fullname;
      this.driverId = singleUser.contactId;
      this.dispatchEvent(
        new CustomEvent("closeparent", { detail: { message: 'dialog' } })
      );
      this.notiTextMessage = (singleUser.notiMessage === null) ? "" : singleUser.notiMessage;
      if (key === 'textMessage') {
        this.textMessaging = true;
      } else if(key === 'notification'){
        this.msgIndex = id;
        this.isNotification = true;
      } else if (key == 'insuranceUpload') {
        this.fileKey = key;
        this.fileId = id;
        const fileInput = this.template.querySelector('input[type="file"]');
        fileInput.click();
      }else {
        this.textMessaging = false;
        this.isNotification = false;
      }
    }
  }
  //This function to get latest updated values of datatable
  getUsers() {
    manageNotificationController({ accId: this.accountId, adminId: this.contactId })
      .then(response => {
        this.data = [];
        this.data = JSON.parse(response);
        this.dataList = this.proxyToObject(this.data);
        this.dynamicBinding(this.data, this.accordionKeyFields);
        if(this.selectedData){
          this.data = this.data.map((item) => {
            const selectedItem = this.selectedData.find((selectedItem) => selectedItem.contactId === item.contactId);
              if (selectedItem && selectedItem.isChecked) {
                  return { ...item, isChecked: true };
              }
            return { ...item, isChecked: false };
          });
        }
        console.log('configData3');
        this.template.querySelector("c-user-preview-table").tableListRefresh(this.data);
        this.spinnerComplete();
        this.isdataLoaded = true;
      }).catch(error => {
        console.log('configData-Error', error);
      });
  }
  //Function to get all mileage data
  getMileage() {
    getMileage({ accountId: this.accountId})
      .then(response => {
        this.mileageData = JSON.parse(response);
        this.editableView = true;
        this.dynamicBinding(this.mileageupdate, this.mileageKeyFields);
        this.spinnerComplete();
        this.isMileageLoaded = true;
        this.template.querySelector('.mileage-user-table').tableListRefresh(this.mileageupdate);
      }).catch(error => {
        console.log('Mileage-Error', error);
      });
  }
  spinnerProgress(msg) {
    this.dispatchEvent(
      new CustomEvent("showloader", { detail: { message: msg } })
    );
  }
  spinnerComplete() {
    this.dispatchEvent(
      new CustomEvent("hideloader", { detail: { message: '' } })
    );
  }
  closeNotificationPopup() {
    this.isNotification = false;
  }
  //This function used to attach image for mass text message
  handlemassAtt(event){ 
    const file = event.target.files[0];
    const reader = new FileReader();
    console.log("File reading",file);
    reader.readAsDataURL(file);
    if(!this.insertedText){
      let _selfTarget = this;
      let fileImage = _selfTarget.template.querySelector('.chat__file-image');
      this.messageLoading = false;
      this.fileReaderUpload(event.target);      
      if (_selfTarget.imageUploaded) {
        _selfTarget.readURL(event, fileImage);
      } else {
        fileImage.src = ""
        event.target.value = '';
        console.log("else done")
      }
    }else{
      event.target.value = '';
    }
  }
  readURL(input, element) {
    var readerList;
    if (input.target.files && input.target.files[0]) {
        readerList = new FileReader();
        readerList.onload = function (e) {
            element.src = e.target.result
        }
        readerList.readAsDataURL(input.target.files[0]);
    }
  }
  removeSelection() {
    let _self = this;
    _self.template.querySelector('.chat__file-image').src = "";
    _self.imageUploaded = false;
    _self.template.querySelector('input[data-id="attatch"]').value = "";
  }
  //Here we are reading the png/jpeg file and validate
  fileReaderUpload(baseTarget) {
    var fileSize, choosenfileType = '',
        photofile, reader, fileExt, i = 0,
        exactSize, fIndex, subString;
    this.choosefile = baseTarget;
    if (this.choosefile) {
        fileSize = this.choosefile.files[0].size;
        photofile = baseTarget.files[0];
        choosenfileType = photofile.type;
        this.fileList = photofile;
        this.chooseFileName = photofile.name;
        fIndex = this.chooseFileName.lastIndexOf(".");
        subString = this.chooseFileName.substring(fIndex, this.chooseFileName.length);
        if (subString === '.jpg' || subString === '.png' || subString === '.jpeg') {
            if (this.choosefile) {
                if (this.choosefile.files[0].size > 0 && this.choosefile.files[0].size < 300000) {
                    this.choosefile = baseTarget;
                    this.imageUploaded = true;
                    this.template.querySelector('.send-message').classList.remove('send-icon');
                    this.template.querySelector('.send-message').classList.add('send-icon_allowed');
                } else {
                    if (this.imageUploaded) {
                        this.template.querySelector('.send-message').classList.remove('send-icon_allowed');
                        this.template.querySelector('.send-message').classList.add('send-icon');
                    }
                    this.imageUploaded = false;
                    console.error('Base 64 Encoded file is too large.  Maximum size is 300 KB .');
                }
            } else {
                if (this.imageUploaded) {
                    this.template.querySelector('.send-message').classList.remove('send-icon_allowed');
                    this.template.querySelector('.send-message').classList.add('send-icon');
                }
                this.imageUploaded = false;
                console.error('There was an error uploading the file. Please try again');
            }
        } else {
          if (this.imageUploaded) {
          }
          this.imageUploaded = false;
          console.error('Please upload correct File. File extension should be .png, .jpg or .jpeg');
        }
        reader = new FileReader();
        reader.onload = function () {
            this.fileResult = reader.result;
        };
        reader.readAsDataURL(photofile);
        fileExt = new Array('Bytes', 'KB', 'MB', 'GB');
        while (fileSize > 900) {
            fileSize /= 1024;
            i++;
        }
        exactSize = (Math.round(fileSize * 100) / 100) + ' ' + fileExt[i];
        this.fileName = this.chooseFileName;
        this.fSize = exactSize;
    }
  }
  onKeyPress(event) {
    let textPos = this.template.querySelector('.message-input').value;
    this.template.querySelector('.message-input').value.trimEnd();
    if (event.keyCode === 13 || (event.keyCode === 32 && textPos.length === 0)) {
        event.preventDefault();
    }
  }
  //Here we are adding style for textarea of mass text message
  onCreateSMS() {
    let areaPos = this.template.querySelector('.message-input').value;
    if (areaPos.length > 0) {
        this.insertedText = true;
        this.messageLoading = true;
        this.template.querySelector('.send_chat_button').style.pointerEvents = 'auto';
    } else {
        this.messageLoading = false;
        this.insertedText = false;
        this.template.querySelector('.send_chat_button').style.pointerEvents = 'none';
    }
  }
  //This function for send mass text message with attatchment
  sendMassMessage(event) {
    let _self = this;
    var selected = this.items;
    if (_self.imageUploaded === false && _self.insertedText) {
        let caretPos = _self.template.querySelector('.message-input').value;
        this.messageLoading = false;
        if (caretPos === "") {
            event.preventDefault();
        } else {
            sendMessageToMultipleContacts({
                contactId: selected,
                message: caretPos
            }).then((result) => {
                _self.stopAnimation();
                _self.insertedText = false;
                console.log("result from sendMessageToContact", result)
            }).catch(error => {
                console.log("error from sendMessageToContact", error)
            })
            _self.template.querySelector('.message-input').value = "";
            event.preventDefault();
        }
    }
    else {
        let textValue = _self.template.querySelector('.message-input').value;
        _self.uploadFileInChunkAtt(textValue);
        _self.template.querySelector('.message-input').value = ""
        let toHeight = _self.template.querySelector('.doc-container').offsetHeight;
        if (toHeight != null || toHeight !== undefined) {
            _self.template.querySelector('.messageArea').style.maxHeight = (toHeight - 180) + 'px'
        } else {
            _self.template.querySelector('.messageArea').style.maxHeight = 377 + 'px';
        }
    }
  }
  uploadFileInChunkAtt(textValue) {
    var file = this.fileList;
    var maxStringSize = 6000000; 
    var maxFileSize = 300000; 
    if (file !== undefined) {
        this.messageLoading = true;
        this.template.querySelector('.chat__file-image').src = "";
        this.imageUploaded = false;
        this.template.querySelector('.send_chat_button').style.pointerEvents = 'none';
        this.template.querySelector('.send-message').classList.remove('send-icon_allowed');
        this.template.querySelector('.send-message').classList.add('send-icon');
        if (file.size <= maxFileSize) {
            this.attachmentName = this.chooseFileName;
            this.fileReader = new FileReader();
            this.fileReader.onerror = function () {
                this.toggleError('There was an error reading the file.  Please try again.');
            }
            this.fileReader.onabort = function () {
                console.log("Reading aborted!");
                this.toggleError('There was an error reading the file.  Please try again.');
            }
            this.fileReader.onloadend = ((e) => {
                e.preventDefault();
                this.attachment = window.btoa(this.fileReader.result);
                this.positionIndex = 0;
                this.fileSize = this.attachment.length;
                this.doneUploading = false;
                if (this.fileSize < maxStringSize) {
                    this.uploadAttachment(textValue)
                } else {
                    this.toggleError('Base 64 Encoded file is too large.  Maximum size is ' + maxStringSize + ' your file is ' + this.fileSize + '.');
                }
            })
            this.fileReader.readAsBinaryString(file);
        } else {
            console.log()
        }
    } else {
        console.log();
    }
  }
  uploadAttachment(textValue) {
    var attachmentBody = "";
    if (this.fileSize <= this.positionIndex + this.chunkSize) {
        attachmentBody = this.attachment.substring(this.positionIndex);
        this.doneUploading = true;
    } else {
        attachmentBody = this.attachment.substring(this.positionIndex, this.positionIndex + this.chunkSize);
    }
    sendImageToMultipleContacts({
            contactId: this.driverId,
            attachmentBody: attachmentBody,
            attachmentName: this.attachmentName,
            message: (textValue === '') ? null : textValue
        })
        .then((result) => {
            this.messageLoading = false;
            this.insertedText = false;
            if (result === 'success') {
                console.log(result)
            } else {
                this.positionIndex += this.chunkSize;
            }
        })
        .catch((error) => {
            console.log(error);
        });
  }
  sendMassAttatchment(){
    const fileInput = this.template.querySelector('input[data-id="attatch"]');
      fileInput.click();
  }
  //Function to send notification message
  sendNotification(evt) {
    var textInput = this.template.querySelector(`data-id${this.msgIndex},.noti_TextInput`).value, notification = [];
    console.log('textInput ',textInput);
    this.spinnerProgress('Sending...');
    evt.preventDefault();
    if (textInput === "") {
      this.spinnerComplete();
      this.template.querySelector(`data-id${this.msgIndex},.span-error`).classList.remove("d-none");
      this.template.querySelector(`data-id${this.msgIndex},.message-controls`).classList.add("border-error");
    } else {
      this.template.querySelector(`data-id${this.msgIndex},.span-error`).classList.add("d-none");
      this.template.querySelector(`data-id${this.msgIndex},.message-controls`).classList.remove("border-error");
      this.notificationObj.notiMessage = textInput;
      notification.push(this.notificationObj);
      console.log("Notification--", JSON.stringify(notification))
      editInlineNewEmployee({
        listofemployee: JSON.stringify(notification),
        adminId: this.contactId
      })
        .then(result => {
          if (result === 'Success') {
            this.getUsers();
            this.isNotification = false;
            let message = "Notification has been sent to " + this.notificationObj.name + ' ' + this.notificationObj.lastname;
            let toastSuccess = { type: "success", message: message };
            toastEvents(this, toastSuccess);
            this.notification = [];
            // console.log('editInlineNewEmployee');
            this.spinnerComplete();
          } else {
            this.spinnerComplete();
          }
        }).catch(error => {
          this.spinnerComplete();
          console.log('editInlineNewEmployee', this.proxyToObject(error));
        });
    }
  } 
  closePopup() {
    this.textMessaging = false
  }
  //This Function is for handle search box of datatable
  handleChange(event){
    this._value = event.target.value;
    var selData = this.selectedData;
    var orginalData = this.dataList;
    this.isSearchEnable = this._value === "" ? true : false;
    this.template.querySelector('c-user-preview-table').searchByKey(this._value);      
    if(this.selectedData){
      this.selectedData = orginalData.map((item) => {
        const selectedItem = this.selectedData.find((selectedItem) => selectedItem.contactId === item.contactId);
          if (selectedItem && selectedItem.isChecked) {
            return { ...item, isChecked: true };
          }
        return { ...item, isChecked: false };
      });     
      this.data = this.selectedData.filter((row) => {
        const nameMatch = row.fullname.toLowerCase().includes(this._value);
        return (nameMatch);
      }); 
      if (!this._value || this._value ==='') {
        this.data = orginalData.map((item) => {
          const selectedItem = this.selectedData.find((selectedItem) => selectedItem.contactId === item.contactId);
            if (selectedItem && selectedItem.isChecked) {
                return { ...item, isChecked: true };
            }
          return { ...item, isChecked: false };
        });
      }
    }
  }
  handleClearInput(){
    this._value = "";
    this.isSearchEnable = this._value == "" ? true : false;
    this.template
    .querySelector("c-user-preview-table")
    .searchByKey(this._value);
  }
  //On click upload icon insurance/location 
  handleFileChange(event) {
    this.file = event.target.files[0];
    const fileInput = event.target;
    this.fileRow = this.data.filter(el => {
      if (this.fileId == el.id) {
        return true;
      }
    });
    if (this.fileKey == 'locationFile') {
      this.locationFileChange(event.target);
      this.uploadLocationInChunk(event,this.fileRow[0]);
      event.target.value = '';
    } else if (this.fileKey == 'insuranceFile' || this.fileKey == 'insuranceUpload') {
        this.uploadInsurance();
    }
  }
  uploadInsurance(){
    var fileSize, choosenfileType = '',
        photofile, reader, fileExt, i = 0,
        exactSize, fIndex, subString;
    this.choosefile = this.file;
    if (this.choosefile) {
      fileSize = this.choosefile.size;
      photofile = this.file;
      choosenfileType = photofile.type;
      this.fileList = photofile;
      this.chooseFileName = photofile.name;
      fIndex = this.chooseFileName.lastIndexOf(".");
      subString = this.chooseFileName.substring(fIndex, this.chooseFileName.length);
      if (subString === '.pdf' || subString === '.PDF') {
        if (this.choosefile) {
          if (this.choosefile.size > 0 && this.choosefile.size < 4350000) {
              this.choosefile = photofile;
              this.pdfUploaded = true;
              this.uploadFileInChunk();
              this.errorUploading = '';
          } else {
              this.pdfUploaded = false;
              let toastFinish = { type: "error", message: 'Base 64 Encoded file is too large.  Maximum size is 4 MB .' };
              toastEvents(this, toastFinish);
              this.isSpinner = false;
              console.log('error');
            }
      }
    }else {
      this.pdfUploaded = false;
        let toastFinish = { type: "error", message: 'Please upload correct File. File extension should be .pdf/.PDF' };
        toastEvents(this, toastFinish);
        this.isSpinner = false;
        console.error('There was an error');
    }
    reader = new FileReader();
    reader.onload = function () {
        this.fileResult = reader.result;
    };
    reader.readAsDataURL(photofile);
    this.template.querySelector('input[data-id="upload"]').value = '';
  }
}
  locationFileChange(element) {
    var chooseFileName = '';
    var choosefile = '';
    var findex = '';
    var strsubstring = '';
    var choosenfileType = '';
    var choosefile = '';
    findex = (element.files[0].name).lastIndexOf(".");
    var photofile = element.files[0];
    chooseFileName = photofile.name;
    strsubstring = (chooseFileName).substring(findex, chooseFileName.length);
    if (strsubstring == '.xls' || strsubstring == '.xlsx' || strsubstring == '.csv') {
        if (photofile.size > 0 && photofile.size < 4350000) {
            choosefile = element;
            this.locationChoose.push(element);
        }
        else {
            let toastFinish = { type: "error", message: 'Base 64 Encoded file is too large.  Maximum size is 4 MB .' };
            toastEvents(this, toastFinish);
            this.isSpinner = false;
        }
    }
    else {
      let toastFinish = { type: "error", message: 'Please upload correct File. File extension should be .csv or .xls.' };
      toastEvents(this, toastFinish);
      this.isSpinner = false; 
    }
    choosenfileType = photofile.type;
    var reader = new FileReader();
    this.locationfsize = element.files[0].size;
    reader.onload = function (e) {
        this.locationdata = reader.result;
    };
    reader.readAsDataURL(photofile);

  }
  uploadLocationInChunk(element,contact) {
    var lfile;
    if (element.currentTarget != null || element.currentTarget != undefined) {
      this.locationChoose.forEach(fl => {
          if (fl.name === element.currentTarget.name) {
              lfile = fl.files[0];
          }
      })
      if (lfile != undefined) {
        var selectedFile = lfile;
        var reader = new FileReader();
        var json_object;
        reader.onload = function (event) {
            var data = this.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            const testURL = window.location.href;
            let newURL = new URL(testURL).searchParams;
            this.accountId =  newURL.get('id');
            workbook.SheetNames.forEach(function (sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                json_object = JSON.stringify(XL_row_object);
            });     
        };
        reader.onloadend = ((e) => {
          this.uploadLocationAttachment(json_object,contact.triploguserid);
        })
        reader.onerror = function (event) {
            console.error("File could not be read! Code ");
        };
        reader.readAsBinaryString(selectedFile);
      }
    }
  }
  uploadLocationAttachment(json,usertriplogId){
    var newArray;
    var replaceKeys = { "Default Activity (optional)": "activity", "Latitude (optional)": "latitude", "Longitude (optional)": "longitude", "Name (optional)": "name", "Address": "address" };
    var locationBody = JSON.parse(json);
    if (locationBody[0] != null || locationBody[0] != undefined) {
        var locationKeys = Object.keys(locationBody[0]);
        if (locationKeys.includes("Default Activity (optional)") || locationKeys.includes("Latitude (optional)")
            || locationKeys.includes("Longitude (optional)") || locationKeys.includes("Name (optional)")
            || locationKeys.includes("Address")) {  
            newArray = this.changeKeyObjects(locationBody, replaceKeys);
            newArray.forEach(ob => {
                ob.userId = usertriplogId
            });
            if (newArray.length > 100) {
                let toastFinish = { type: "error", message: 'You can upload 100 locations at a time.' };
                toastEvents(this, toastFinish);
                this.isSpinner = false; 
            } else {
              this.isSpinner = true;
              this.template.querySelector('c-file-upload-spinner').messageUrl(this.fileKey);
              this.locationAttachment = JSON.stringify(newArray);
              UploadLocation({ location: this.locationAttachment, accId: this.accountId})
                  .then(response => {
                    console.log('uploadLocations', response);
                    let toastFinish = { type: "success", message: 'We have received your upload, the data will be processed and made available within 72 work hours.' };
                    toastEvents(this, toastFinish);
                    this.getUsers(); 
                    this.isSpinner = false;               
                  }).catch(error => {
                    console.log('uploadLocations-Error', error);
                    let toastFinish = { type: "error", message: 'Location file failed to upload.' };
                    toastEvents(this, toastFinish);
                    this.isSpinner = false;
                  }); 
              }
        } else {
            let toastFinish = { type: "error", message: 'The file you have uploaded is not valid for location.' };
            toastEvents(this, toastFinish);
            this.isSpinner = false;
        }
    } else {
      let toastFinish = { type: "error", message: 'The file you have uploaded is not valid for location.' };
      toastEvents(this, toastFinish);
      this.isSpinner = false;
    }
  }
  changeKeyObjects = (arr, replaceKeys) => {
    return arr.map(item => {
        const newItem = {};
        Object.keys(item).forEach(key => {
            newItem[replaceKeys[key]] = item[[key]];
        });
        return newItem;
    });
  };
  //Reads a file in chunks and performs a specific operation on each chunk.
  uploadFileInChunk() {
    var file = this.fileList;
    var maxStringSize = 6000000;
    var maxFileSize = 4350000;
    if (file !== undefined) {
        if (file.size <= maxFileSize) {
            this.attachmentName = this.chooseFileName;
            this.fileReader = new FileReader();
            this.fileReader.onerror = function () {
              let toastFinish = { type: "error", message: 'There was an error reading the file.  Please try again.' };
              toastEvents(this, toastFinish);
              this.isSpinner = false;
            }
            this.fileReader.onabort = function () {
              let toastFinish = { type: "error", message: 'There was an error reading the file.  Please try again.' };
              toastEvents(this, toastFinish);
              this.isSpinner = false;
            }
            this.fileReader.onloadend = ((e) => {
                e.preventDefault();
                this.attachment = window.btoa(this.fileReader.result);
                this.positionIndex = 0;
                this.fileSize = this.attachment.length;
                if (this.fileSize < maxStringSize) {
                    this.uploadAttachment(null)
                } else {
                    let toastFinish = { type: "error", message: 'Base 64 Encoded file is too large.  Maximum size is ' + maxStringSize + ' your file is ' + this.fileSize+'.' };
                    toastEvents(this, toastFinish);
                    this.isSpinner = false;
                    this.fileInputRef.value = null;
                }
            })
            this.fileReader.readAsBinaryString(file);
        } else {
            this.pdfUploaded = false;
            this.isSpinner = false;
        }
    } else {
        this.isSpinner = false;
    }
  }
  uploadAttachment(fileId) {
    var attachmentBody = "";
    this.isSpinner = true;
    this.template.querySelector('c-file-upload-spinner').messageUrl(this.fileKey);
    if (this.fileSize <= this.positionIndex + this.chunkSize) {
        attachmentBody = this.attachment.substring(this.positionIndex);
        this.doneUploading = true;
    } else {
        attachmentBody = this.attachment.substring(this.positionIndex, this.positionIndex + this.chunkSize);
    }
    let attatchment = this.data.filter(el => {
      if (el.id == this.fileId) {
        return true;
      }
    });
    const testURL = window.location.href;
    let newURL = new URL(testURL).searchParams;
    readFromFileInchunk({
            attachmentBody: attachmentBody,
            attachmentName: this.attachmentName,
            attachmentId: fileId,
            did: attatchment[0].contactId,
            accid: this.accountId,
            contactattachementid: attatchment[0].insuranceId
        })
        .then((file) => {
            if (this.doneUploading === true) {
              let toastFinish = { type: "success", message: 'The insurance documentation has been successfully uploaded.' };
              toastEvents(this, toastFinish);
              this.isSpinner = false;
              this.pdfUploaded = true;
              this.attachment = "";
              attachmentBody = "";
              this.fileSize = 0;
              this.fileResult = null;
              this.choosefile = "";
              this.getUsers();  
            } else {
                this.isSpinner = false;
                this.positionIndex += this.chunkSize;
                this.uploadAttachment(file);
            }
        })
        .catch((error) => {
            console.log(error);
            this.isSpinner = false;
        });
  }
  closeModal() {
    this.isModalOpen = false;
  }
  proxyToObject(e) {
    return JSON.parse(e);
  }
  //Dynamically binds data to the DataTable component.
  dynamicBinding(data, keyFields) {
    data.forEach(element => {
      let model = [];
      for (const key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          let singleValue = {}
            if (keyFields.includes(key) !== false) {
              singleValue.key = key;
              singleValue.value = element[key];
              singleValue.uId = (element.contactId) ? element.contactId : element.id;
              singleValue.isDate = key === "expirationDate" ? true : false;
              singleValue.isSortable = key === "expirationDate" ? false : false;
              singleValue.truncate = (key === 'notiMessage') ? (element[key] !== null) ? true : false : false;
              singleValue.tooltip = (key === 'notiMessage') ? (element[key] !== null) ? true : false : false;
              singleValue.tooltipText = (key === 'notiMessage') ? (element[key] !== null) ? element[key] : false : false;
              singleValue.cIcon = (key === 'notiMessage') ? (element[key] !== null) ? true : false : false;
              singleValue.tooltipIcon =  this.deleteIconUrl;
              singleValue.infoText = 'Delete Notification';
              singleValue.onlyIcon = (key === "messageHolder" || key === "locationFile" || key === "insuranceFile") ? true : false;
              /*Added by Megha */

              if (element.role === "Manager") {
                if (element.trueDialogId) {
                  if (element.insuranceId !== null) {
                    singleValue.multipleIcon =  (key === "messageHolder") ? [{ "key": "textMessage", "iconUrl": this.textIconUrl }, { "key": "notification", "iconUrl": this.notificationIconUrl }] : (key === "insuranceFile") ? [{ "key": "insuranceUpload", "iconUrl": this.fileIconUrl }, { "key": "downloadInsurance", "iconUrl": this.downloadIconUrl, "renderAsLink": true, "fileName": "Insurance", "url": `/app/servlet/servlet.FileDownload?file=${element.insuranceId}` }] : null;
                    singleValue.iconUrl = (key === "messageHolder") ? this.notificationIconUrl : (key === "locationFile" || key === 'insuranceFile') ? this.fileIconUrl : '';
                  }else{
                    singleValue.multipleIcon = (key === "messageHolder") ? [{ "key": "textMessage", "iconUrl": this.textIconUrl }, { "key": "notification", "iconUrl": this.notificationIconUrl }] : (key === "insuranceFile") ? [{ "key": "insuranceUpload", "iconUrl": this.fileIconUrl }, { "key": "", "iconUrl": "" }] :null;
                    singleValue.iconUrl = (key === "messageHolder") ? this.notificationIconUrl : (key === "locationFile" || key === 'insuranceFile') ? this.fileIconUrl : '';
                  }
                } else {
                  if (element.insuranceId !== null) {
                    singleValue.multipleIcon =  (key === "messageHolder") ? [{ "key": "", "iconUrl": "" }, { "key": "notification", "iconUrl": this.notificationIconUrl }] : (key === "insuranceFile") ? [{ "key": "insuranceUpload", "iconUrl": this.fileIconUrl }, { "key": "downloadInsurance", "iconUrl": this.downloadIconUrl, "renderAsLink": true, "fileName": "Insurance", "url": `/app/servlet/servlet.FileDownload?file=${element.insuranceId}` }] : null;
                    singleValue.iconUrl = (key === "messageHolder") ? this.notificationIconUrl : (key === "locationFile" || key === 'insuranceFile') ? this.fileIconUrl : '';
                  }else{
                    singleValue.multipleIcon = (key === "messageHolder") ? [{ "key": "", "iconUrl": "" }, { "key": "notification", "iconUrl": this.notificationIconUrl }] : (key === "insuranceFile") ? [{ "key": "insuranceUpload", "iconUrl": this.fileIconUrl }, { "key": "", "iconUrl": "" }] : null;
                    singleValue.iconUrl = (key === "messageHolder") ? this.notificationIconUrl : (key === "locationFile" || key === 'insuranceFile') ? this.fileIconUrl : '';
                  }
                }
              } else {
                if (element.trueDialogId) {
                  if (element.insuranceId !== null) {
                    singleValue.multipleIcon =  (key === "messageHolder") ? [{ "key": "textMessage", "iconUrl": this.textIconUrl }, { "key": "notification", "iconUrl": this.notificationIconUrl }] : (key === "insuranceFile") ? [{ "key": "insuranceUpload", "iconUrl": this.fileIconUrl }, { "key": "downloadInsurance", "iconUrl": this.downloadIconUrl, "renderAsLink": true, "fileName": "Insurance", "url": `/app/servlet/servlet.FileDownload?file=${element.insuranceId}` }] : null;
                    singleValue.iconUrl = (key === "messageHolder") ? this.notificationIconUrl : (key === "locationFile" || key === 'insuranceFile') ? this.fileIconUrl : '';
                  }else{
                    singleValue.multipleIcon = (key === "messageHolder") ? [{ "key": "textMessage", "iconUrl": this.textIconUrl }, { "key": "notification", "iconUrl": this.notificationIconUrl }] : (key === "insuranceFile") ? [{ "key": "insuranceUpload", "iconUrl": this.fileIconUrl }, { "key": "", "iconUrl": "" }] :null;
                    singleValue.iconUrl = (key === "messageHolder") ? this.notificationIconUrl : (key === "locationFile" || key === 'insuranceFile') ? this.fileIconUrl : '';
                  }
                } else {
                  if (element.insuranceId !== null) {
                    singleValue.multipleIcon =  (key === "messageHolder") ? [{ "key": "", "iconUrl": "" }, { "key": "notification", "iconUrl": this.notificationIconUrl }] : (key === "insuranceFile") ? [{ "key": "insuranceUpload", "iconUrl": this.fileIconUrl }, { "key": "downloadInsurance", "iconUrl": this.downloadIconUrl, "renderAsLink": true, "fileName": "Insurance", "url": `/app/servlet/servlet.FileDownload?file=${element.insuranceId}` }] : null;
                    singleValue.iconUrl = (key === "messageHolder") ? this.notificationIconUrl : (key === "locationFile" || key === 'insuranceFile') ? this.fileIconUrl : '';
                  }else{
                    singleValue.multipleIcon = (key === "messageHolder") ? [{ "key": "", "iconUrl": "" }, { "key": "notification", "iconUrl": this.notificationIconUrl }]: (key === "insuranceFile") ? [{ "key": "insuranceUpload", "iconUrl": this.fileIconUrl }, { "key": "", "iconUrl": "" }] : null;
                    singleValue.iconUrl = (key === "messageHolder") ? this.notificationIconUrl : (key === "locationFile" || key === 'insuranceFile') ? this.fileIconUrl : '';
                  }
                }
              }

              
              singleValue.onlyLink = (key === "driverName" || key === "fullname") ? true : false;
              singleValue.isLink = (key === "driverName" || key === "fullname") ? true : false;
  
              /*Added by Megha */
              singleValue.isLabel = (key === "insurance") ? true : false;
              singleValue.labelClass = (key === "insurance") ? (element[key] !== null) ? ((element[key] === 'Yes') ? 'status status-text status-success text-green' : (element[key] === 'No' || element[key] === 'Expired') ? 'status status-text status-error text-red' : 'status status-text status-normal') : '' : '';
              /*Added by Megha ends -- */
              model.push(singleValue);
            }
          singleValue.id = (element.contactId) ? element.contactId : element.id;
        }
      }
      if(element.expirationDate){
        for (let i = 0; i < this.accordionListColumn.length; i++) {
          if (this.accordionListColumn[i].colName === 'expirationDate') {
              delete this.accordionListColumn[i].sort;
              break; 
          }
        }
      }
      element.id = (element.contactId) ? element.contactId : element.id;
      element.toggle = false;
      element.isChecked = false;
      element.keyFields = this.mapOrder(model, keyFields, 'key');
    });
  }
  connectedCallback() {
    this.onloadTool = true;
    this.istrueMessaging = false;
    this.istrueInsurance = false;
    this.isScrollable = true;
    this.paginatedModal = true;
    this.modalListColumn = [];
    this.modalKeyFields = [];
    this.isCheckbox = true;
    const today = new Date();
    this.notificationDate = today;
    this.loadManageNotification();
  }
  //Function to get all contact data with specific account 
  loadManageNotification(){
    manageNotificationController({ accId: this.accountId, adminId: this.contactId})
      .then(response => {
        this.data = JSON.parse(response);
        this.dataList = this.data;
        this.dynamicBinding(this.data, this.accordionKeyFields);
        console.log('configData', JSON.stringify(this.data));
        this.isdataLoaded = true;
      }).catch(error => {
        console.log('configData-Error', error);
      });
  }
  proxyToObject(data) {
    return JSON.parse(JSON.stringify(data));
  }
  mapOrder(array, order, key) {
    array.sort(function (a, b) {
      var A = a[key],
        B = b[key];
      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      }
      return -1;
    });

    return array;
  }
  //This function to cleare all notigfication message fro datatable
  handleClearMass(){
    this.startSpinner();
    clearMassNotification({ accID: this.accountId})
      .then(response => {
        this.template.querySelector('c-user-preview-table').toggleCheckBox(false);
        let toastFinish = { type: "success", message: 'Notification message cleared successfully!!' };
        toastEvents(this, toastFinish); 
        if(this.istrueMessaging){
          this.massNotimessageLabel = 'Mass Notification Message';
        }else if(this.istrueInsurance){
          this.insuranceLabel = 'Send Insurance Reminder';
        }
        this.getUsers();
        this.stopSpinner();
      }).catch(error => {
        console.log('clearMassNotification-Error', error);
      });
  }
  handleInsuranceReminder() {
    if (this.template.querySelector('c-user-profile-modal')) {
      this.template.querySelector('c-user-profile-modal[data-id="menu"]').hide();
      this.insuranceLabel = 'Send Insurance Reminder';
      this.istrueInsurance = true;
      this.onloadTool = false;
      this.istrueMessaging = false;
    }
  }
  //Function to delete/cleare single nottification message
  deleteNotification(event) {
    clearNotification({
      contactID: event.detail.id
    }).then(response => {
     if(response === 'Success'){
      this.getUsers();
     }
    }).catch(error => {
      console.log(this.proxyToObject(error));
    });
    console.log("event---", event.detail.id)
  }
  handleMessaging() {
    this.onloadTool = false;
    this.isModalOpen = false;
    this.istrueMessaging = true;
    this.istrueInsurance = false;
    this.template.querySelector('c-user-profile-modal[data-id="menu"]').hide();
  }
  getMonthName(monthNumber) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months[monthNumber - 1];
  }
  //This function is for Mileage menu option
  handleMilleage() {
    this.isdataLoaded = false;
    this.istrueInsurance = false;
    this.isMileageLoaded = true;
    this.isModalOpen = false;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const monthName = this.getMonthName(currentMonth);
    this.template.querySelector('c-user-profile-modal[data-id="menu"]').hide();
    this.mileageKeyFields = ["driverName", "totalMileage"];
    this.mileageListColumn = [
      {
        "id": 1,
        "name": "Name",
        "colName": "driverName",
        "colType": "String",
        "arrUp": false,
        "arrDown": false
      },
      {
        "id": 2,
        "name": monthName,
        "colName": "totalMileage",
        "colType": "String",
        "arrUp": false,
        "arrDown": false
      }
    ];
    this.isCheckbox = false;
    getMileage({ accountId: this.accountId})
      .then(response => {
        this.mileageData = JSON.parse(response);
        console.log('Mileage-Data-', response);
        this.editableView = true;
        this.dynamicBinding(this.mileageData, this.mileageKeyFields);
      }).catch(error => {
        console.log('configData-Error', error);
      });

  }
  //this function to handle datatable checkbox event
  handleUpdateList(event) {  
    this.selectedData = JSON.parse(event.detail);
    this.items = this.selectedData.filter(el => {
      if (el.isChecked) {
        return true;
      }
    });
    console.log('handleUpdateList',this.selectedData);
    console.log('this.items',this.items);
    if (this.items.length === this.data.length) {
        this.checkAll = true;
    }else{
      this.checkAll = false;
    }
    if (this.istrueInsurance) {
      this.insuranceLabel = 'Send Mail';
    } else if (this.onmassText) {
      this.messagingLabel = 'Create Text Message';
    }else if (this.onnotificationMessage) {
      this.massNotimessageLabel = 'Create Notification Message';
    }
    
  }
  handleUpdateListMileage(event){
    this.mileageupdate = JSON.parse(event.detail);
  }
  editMode() {
    this.isEditMode = true;
    console.log('EditMode');
  }
  cancelEditMode(){
		console.log("cancelEditMode");
    this.isEditMode = false;
  }
  enableSubmit() {
    if(this.isSubmitVisible) {
      return
    }
    this.isSubmitVisible = true;
  }
  //Function to update inline mileage data
  updateMileage(){
    this.startSpinner();
    this.isEditMode = false;
    UpdateImportMileage({ responseData: JSON.stringify(this.mileageupdate)})
        .then(response => {
          console.log('updateMileage', response);
          this.getMileage();
          this.isEditMode = false;
          this.stopSpinner();  
          let toastFinish = { type: "success", message: 'Updated successfully.' };
          toastEvents(this, toastFinish);  
        }).catch(error => {
          this.isEditMode = false;
          console.log('updateMileage-Error', error);
          this.stopSpinner(); 
          let toastFinish = { type: "error", message: 'some error occur.' };
          toastEvents(this, toastFinish);
        });
  }
  startSpinner() {
    this.dispatchEvent(
      new CustomEvent("show", {
        detail: "spinner"
      })
    );
  }
  stopSpinner() {
    this.dispatchEvent(
      new CustomEvent("hide", {
        detail: "spinner"
      })
    );
  }
  handleMassNotiMessage(){
    this.template.querySelector('c-user-preview-table').toggleCheckBox(true);
    this.isTrueCancelProcess = true;
    this.onmassText = false;
    this.onnotificationMessage = true;
    if (this.massNotimessageLabel == 'Create Notification Message') {
      console.log('handleMassNotiMessage');
      this.template.querySelector('c-user-profile-modal[data-id="notificationmessage"]').show();
    }
  }
  // sendMassMessage(){
  //   var textInput = this.template.querySelector('textarea[data-id="textMessage"]').value, textMessage = [];
  //   console.log('textInput',textInput);
  //   var selected = this.items;
  //   console.log('selected',JSON.stringify(selected));
    
  //   sendMessageToMultipleContacts({ trueDialogContactIdList: JSON.stringify(selected), message: textInput})
  //         .then(response => {
  //           console.log('Multi Text', response);
  //         }).catch(error => {
  //           console.log('text-Error', error);
  //         });
  // }
  //Function to send mass notification message with selected users
  sendMassNotification(){
    var textInput = this.template.querySelector('textarea[data-id="massNoti"]').value, notification = [];
    console.log('textInput',textInput);
    this.startSpinner();
    this.items.forEach(element => {  
      let singleUser = this.getUser(element.contactId);
      this.notificationObj = singleUser;
      console.log('singleUser',singleUser);
      this.notificationObj.notiMessage = textInput;
      notification.push(this.notificationObj);
    }); 
    if (textInput === "") {
    } else {
      console.log("Notification--", JSON.stringify(notification))
      editInlineNewEmployee({
        listofemployee: JSON.stringify(notification),
        adminId: this.contactId
      })
        .then(result => {
          if (result === 'Success') {
            this.getUsers();
            this.isNotification = false;
            this.template.querySelector('c-user-profile-modal[data-id="notificationmessage"]').hide();
            this.template.querySelector('c-user-preview-table').toggleCheckBox(false);
            this.stopSpinner();
            let message = "Notification has been sent successfully.";
            let toastSuccess = { type: "success", message: message };
            toastEvents(this, toastSuccess);
            this.massNotimessageLabel = 'Mass notification message';
            this.notification = [];
          } else {
            let message = "Some error has occur";
            let toastSuccess = { type: "error", message: message };
            toastEvents(this, toastSuccess);
          }
        }).catch(error => {
          let message = "Some error has occur";
          let toastSuccess = { type: "error", message: message };
          toastEvents(this, toastSuccess);
          this.spinnerComplete();
          console.log('editInlineNewEmployee', this.proxyToObject(error));
        });
    }
  }
  //Function to send Insurance mail to selected user
  handleSendInsuranceReminder() {  
    this.istrueInsurance = true;
    this.isTrueCancelProcess = true;
    this.istrueMessaging = false;
    var insurance = [];
    this.items.forEach(element => {  
      let singleUser = this.getUser(element.contactId);
      this.insuranceObj = singleUser;
      insurance.push(this.insuranceObj);
    }); 
    if (this.insuranceLabel == 'Send Mail') {
      this.startSpinner();
        sendAllInsuranceEmail({ listofemployee: JSON.stringify(insurance), adminId: this.contactId })
          .then(response => {
            console.log('sendMail', response);
              this.stopSpinner();  
              this.template.querySelector('c-user-preview-table').toggleCheckBox(false);
              let toastFinish = { type: "success", message: 'Insurance reminder mail successfully sent.' };
              toastEvents(this, toastFinish);  
              this.insuranceLabel = 'Send Insurance Reminder';
              this.getUsers();
          }).catch(error => {
            console.log('send-Error', error);
              this.stopSpinner();  
              let toastFinish = { type: "error", message: 'Some error has occur.' };
              toastEvents(this, toastFinish);
          });
    }else{
      this.template.querySelector('c-user-preview-table').toggleCheckBox(true);
    }
  }
  handleMassTextMessage() {
    this.template.querySelector('c-user-preview-table').toggleCheckBox(true);
    this.isTrueCancelProcess = true;
    console.log('selectedMassText', this.items);
    this.onmassText = true;
    this.onnotificationMessage = false;
    if (this.messagingLabel == 'Create Text Message') {
      console.log('Create Text Message');
      this.template.querySelector('c-user-profile-modal[data-id="message"]').show();

    }
  }
  //This function for cancle process will reset/cancal ongoig process
  handleCancelProcess() {
    this.template.querySelector('c-user-preview-table').toggleCheckBox(false);
    this.insuranceLabel = 'Send Insurance Reminder';
    this.messagingLabel = 'Mass Text Message';
    this.massNotimessageLabel = 'Mass Notification Message';
    this.isTrueCancelProcess = false;
    this.istrueInsurance = false;
    this.getUsers();
    this.isMileageLoaded = false;
    this.isdataLoaded = true;
    this.onloadTool = true;
    this.istrueMessaging = false;
  }
  //Function to download location template
  downloadLocationTemp() {
    this.locationData = [
      ['Name (optional)', 'Address', 'Latitude (optional)', 'Longitude (optional)', 'Default Activity (optional)']
    ];
    let colName = [];
    console.log('row');

    let sheetName = "Location Template"
    let filename = "Location Template "+this.dateTime(new Date());
    colName.push([
			"Name (optional)",
			"Address",
			"Latitude (optional)",
      "Longitude (optional)",
      "Default Activity (optional)",
		]);
    this.locationData.forEach(ele => {
			colName.push([
				"The White House",
				"1600 Pennsylvania Ave NW, Washington, DC 20500",
				"38.683885",
        "-8.6109719",
        "Business"
			]);
		});
    console.log('row2',sheetName);
    this.template.querySelector("c-export-excel").download(colName, filename, sheetName);
  }
  dateTime(date) {
		var yd, ydd, ymm, yy, hh, min, sec;
		yd = date;
		ydd = yd.getDate();
		ymm = yd.getMonth() + 1;
		yy = yd.getFullYear();
		hh = yd.getHours();
		min = yd.getMinutes();
		sec = yd.getSeconds();
		ydd = ydd < 10 ? "0" + ydd : ydd;
		ymm = ymm < 10 ? "0" + ymm : ymm;
		return (
		  ymm.toString() +
		  ydd.toString() +
		  yy.toString() +
		  hh.toString() +
		  min.toString() +
		  sec.toString()
		);
	  }
  sort(employees, colName) {
		employees.sort((a, b) => {
		  let fa =
			  a[colName] == null || a[colName] === ""
				? ""
				: a[colName].toLowerCase(),
			fb =
			  b[colName] == null || b[colName] === ""
				? ""
				: b[colName].toLowerCase();
	
		  if (fa < fb) {
			return -1;
		  }
		  if (fa > fb) {
			return 1;
		  }
		  return 0;
		});
	
		return employees;
	  }
  //Function to export all data from datatable to Excel
  exportToExcel() {
    let colName = [];
    let data = this.sort(this.data, "name");
    let sheetName = "Insurance Report"
    let filename = "Insurance Report "+this.dateTime(new Date());
    colName.push([
			"Name",
			"Insurance Status",
			"Expires",
		]);
    data.forEach(ele => {
			colName.push([
				ele.fullname,
				ele.insurance,
				ele.expirationDate
			]);
		});
    this.template.querySelector("c-export-excel").download(colName, filename, sheetName);
  }
  handleBackToDashboard() {
    this.dispatchEvent(new CustomEvent('backtodashboard', {}));
  }
}