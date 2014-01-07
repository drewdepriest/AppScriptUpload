// Script-as-app template.
function doGet() {
    
  // initiate the app variable
  var app = UiApp.createApplication().setTitle('Fun with File Uploads');
  
  // used to space out questions
  var spacer = app.createLabel('-');
  spacer.setStyleAttribute('lineHeight','140%');
  spacer.setStyleAttribute('color','#FFFFFF');
  
  // Wrap everything in a single formPanel
  var fPanel = app.createFormPanel().setSize('50%','50%');
  
  // Container for widget elements: absolute panel
  var fTable = app.createFlexTable().setId('ft');
  fTable.setStyleAttribute('marginTop','20');
  fTable.setStyleAttribute('marginLeft','20');

  // checkbox example - question
  var questionLabel = app.createLabel('Why would you check this box?');
  
  // checkbox example - boxes
  var cb1 = app.createCheckBox('You told me to.').setName('told-me-to'); 
  var cb2 = app.createCheckBox('Boredom.').setName('boredom'); 
  var cb3 = app.createCheckBox('Acceptance.').setName('acceptance');
  var cbOther = app.createCheckBox('Other reasons, obviously.').setName('otherCb');
  var otherTb = app.createTextBox().setWidth('150px').setName('otherTb').setId('otherTb');
  
  // set the 'other' textbox invisible until user clicks the checkbox
  otherTb.setVisible(false);
  
  // if user checks the 'other' box, make the 'other' textbox appear; otherwise, hide it
  var otherCheckHandler = app.createServerHandler('addOtherTb');
  cbOther.addValueChangeHandler(otherCheckHandler);
  
  // file upload
  var uploadLabel = app.createLabel('Please attach a photo illustrating your excitement in checking a box above.');
  var uploadLabel2 = app.createLabel('PG only, please. This is a family form.');
  uploadLabel2.setStyleAttribute('fontStyle','italic');
  var fileUpload = (app.createFileUpload().setName('uploadedFile'));
  
  // submit button
  var submitButton = app.createSubmitButton('<B>Submit</B>');
    
  // add components to the formPanel
  fTable.setWidget(0, 0, questionLabel)
        .setWidget(1, 0, spacer)
        .setWidget(2, 0, cb1)
        .setWidget(3, 0, cb2)
        .setWidget(4, 0, cb3) 
        .setWidget(5, 0, cbOther)
        .setWidget(6, 0, otherTb)
        .setWidget(7, 0, spacer)
        .setWidget(8, 0, spacer)
        .setWidget(9, 0, uploadLabel)
        .setWidget(10, 0, uploadLabel2)
        .setWidget(11, 0, fileUpload)
        .setWidget(12, 0, spacer)
        .setWidget(13, 0, spacer)
        .setWidget(14, 0, submitButton)

  // add the flexTable to the formPanel
  fPanel.add(fTable);
  
  // add the formPanel to the app UI
  app.add(fPanel);  
  
  return app;
}

function doPost(e) {
  
  var app = UiApp.getActiveApplication();
  
  // Do something here to store the checkbox values in an existing spreadsheet.
  // This sandbox test deals directly with the file upload, as it's more complex.
  
  /*
  ** Handle file uploads here
  */
  // data returned is a blob for FileUpload widget
  var fileBlob = e.parameter.uploadedFile;
  Logger.log('got the file');
  var doc = DocsList.createFile(fileBlob);
  
  // copy the new file to the specified folder
  var folder = DocsList.getFolder('test-uploads');
  doc.addToFolder(folder);
   
  // delete the file from root (where it uploads by default)
  var root = DocsList.getFolder('');
  doc.removeFromFolder(root);

  //Create stack panel
  var vertPanel = app.createAbsolutePanel().setSize('100%', '100%');
  var submitComplete = app.createLabel('Thanks for your submission!');
  submitComplete.setStyleAttribute('font-weight','bold'); 
  
  vertPanel.add(submitComplete);
  vertPanel.setWidgetPosition(submitComplete, 20, 20);
  
  var folder = DocsList.getFolder('test-uploads');
  var files = folder.getFiles();
  
  var fileStr = app.createLabel();
 
  // loop through directory, show all filenames & timestamps
  for (var i in files) {
    
    // print the filename and file creation timestamp
    var temp = app.createLabel(files[i].getName() + ' created at ' + files[i].getDateCreated());
    vertPanel.add(temp);
    vertPanel.setWidgetPosition(temp, 120, (i*70+40));
    
    
    // display the image scaled down to 80x60
    var tempImg = app.createImage(files[i].getUrl().replace('open','uc')).setSize('80','60');
    vertPanel.add(tempImg);
    vertPanel.setWidgetPosition(tempImg, 20, (i*70+40));
    
  }
  
  app.add(vertPanel);
  return app;
}

 /*
 ** Helper functions
 */

 // if user checks the 'other' box, make the 'other' textbox and label appear
 function addOtherTb(e) {

   var app = UiApp.getActiveApplication();

   if(e.parameter.otherCb == 'true')
   {
     app.getElementById('otherTb').setVisible(true);
   } else {
     app.getElementById('otherTb').setVisible(false); 
   }
   app.close();
   return app;
 }
