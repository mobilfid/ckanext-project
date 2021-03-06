var app = angular.module("app");


app.controller("fieldDatumCtrl", ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'dataService', 'paramService', 'FileUploader', 'ENV', 'cadastaProject', 'fieldDataService', '$mdDialog',
    function ($scope, $rootScope, $state, $stateParams, $location, dataService, paramService, FileUploader, ENV, cadastaProject, fieldDataService, $mdDialog) {



        //modal for adding a parcel
        var fieldDatumModal = function () {
            $mdDialog.show({
                templateUrl: '/project-dashboard/src/partials/fieldDatum.html',
                controller: fieldDatumModalCtrl,
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                locals: {cadastaProject: cadastaProject, fieldDataId: $stateParams.id}
            })
        };


        fieldDatumModal();

        $scope.$on('validate-datum', function(e){
            fieldDatumModal();
        });


        function fieldDatumModalCtrl($scope, $mdDialog, $stateParams, fieldDataService, fieldDataId) {
            $scope.hide = function () {
                $mdDialog.hide();
                $state.go("tabs.overview.project-overview")
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
                $state.go("tabs.overview.project-overview")
            };

            $scope.alertValidateData = function(){
                $rootScope.$broadcast('validate-data');
            }


            $scope.response = '';
            $scope.progress = 0;
            $scope.formObj = {};
            $scope.toggleSelectAll = {value:true, label:'Select All'};


            /**
             * Initialize ag-grid table
             */
            $scope.gridOptions = {
                columnDefs: [],
                rowData: [],
                enableSorting: true,
                enableColResize: true,
                rowSelection: 'multiple',
                checkboxSelection: true,
                suppressRowClickSelection: true,
                onCellClicked: cellClickedFunction
            };


            $scope.selectedCellText = '';


            function cellClickedFunction(event) {
                $rootScope.$apply(function () {
                    $scope.selectedCellText = event.value;
                });

                if (event.colDef.field === 'parcel_id') {
                    $scope.cancel();
                    $state.go("tabs.parcels.parcel", {id: event.node.data.parcel_id})
                }
                else if (event.colDef.field === 'party_id') {
                    $scope.cancel();
                    $state.go("tabs.parties.party", {id: event.node.data.party_id})
                }
                else if (event.colDef.field === 'relationship_id') {
                    $scope.cancel();
                    $state.go("tabs.relationships.relationship", {id: event.node.data.relationship_id})
                }

            }


            /**
             * toggle select all button for field data responses
             */
            $scope.toggleSelectAllButton = function() {
                if($scope.toggleSelectAll.value){
                    selectAll();
                } else {
                    unSelectAll()
                }
            };

            /**
             * Select all respondent ag-Grid check boxes
             */
            function selectAll(){
                $scope.gridOptions.api.forEachNode( function (node) {
                    $scope.gridOptions.api.selectNode(node, true);
                });
                $scope.toggleSelectAll.value = false;
                $scope.toggleSelectAll.label = 'UnSelect All';
            }

            /**
             * unSelect all respondent ag-Grid check boxes
             */
            function unSelectAll(){
                $scope.gridOptions.api.forEachNode( function (node) {
                    $scope.gridOptions.api.deselectNode(node, true);
                });
                $scope.toggleSelectAll.value = true;
                $scope.toggleSelectAll.label = 'Select All';
            }



            $scope.updateStatusRows = function (status) {

                var selectedRespondentIds = [];

                $scope.gridOptions.api.getSelectedNodes().forEach(function (row) {
                    selectedRespondentIds.push(row.data.respondent_id);
                });

                var validate_promise = fieldDataService.updateStatusOfRespondents(cadastaProject.id, $stateParams.id, selectedRespondentIds, status);

                validate_promise.then(function (response) {
                    getFieldDataResponses();

                    $scope.successMessage = 'Respondent(s) ' + response.cadasta_validate_respondent + ' have been updated.';
                    $scope.errorMessage = '';

                    // unselect all checkboxes
                    unSelectAll();

                    $rootScope.$broadcast('updated-field-data');


                }, function (err) {
                    $scope.parties = "Server Error";
                    $scope.successMessage = '';
                    $scope.errorMessage = 'There was an error updating respondents.';
                });
            }


            getFieldDataResponses();


            function getFieldDataResponses(updatedRows) {

                console.log (fieldDataId);

                var promise = fieldDataService.getResponses(cadastaProject.id, fieldDataId);


                promise.then(function (response) {
                    var columnDefs = [];
                    var rowData = [];

                    columnDefs.push({
                        headerName: 'Respondent ID',
                        field: 'respondent_id',
                        checkboxSelection: true,
                        minWidth: 110
                    });
                    columnDefs.push({
                        headerName: 'Validated',
                        field: 'validated',
                        minWidth: 80,
                        cellClass: function (params) {
                            return (params.value === false ? 'font-red' : '');
                        }
                    });
                    columnDefs.push({
                        headerName: 'Parcel ID',
                        field: 'parcel_id',
                        minWidth: 80,
                        cellStyle: {color: '#256c97'}
                    });
                    columnDefs.push({
                        headerName: 'Party ID',
                        field: 'party_id',
                        minWidth: 80,
                        cellStyle: {color: '#256c97'}
                    });
                    columnDefs.push({
                        headerName: 'Relationship ID',
                        field: 'relationship_id',
                        minWidth: 110,
                        cellStyle: {color: '#256c97'}
                    });


                    // put colums definitions together
                    response.features[0].properties.questions.forEach(function (v) {
                        columnDefs.push({headerName: v.properties.label, field: v.properties.question_id, minWidth: 90})
                    });


                    // set table columns
                    $scope.gridOptions.api.setColumnDefs(columnDefs);

                    var dict = {};

                    response.features[0].properties.responses.forEach(function (res) {
                            dict[res.properties.respondent_id] = {}

                        }
                    );

                    Object.keys(dict).forEach(function (k) {
                        var qad = {};
                        response.features[0].properties.responses.forEach(function (res) {
                            if (res.properties.respondent_id == k) {
                                qad[res.properties.question_id] = res.properties.text;
                                qad['validated'] = res.properties.validated;
                                qad['respondent_id'] = res.properties.respondent_id;
                                qad['parcel_id'] = res.properties.parcel_id;
                                qad['party_id'] = res.properties.party_id;
                                qad['relationship_id'] = res.properties.relationship_id;
                                dict[k] = qad;
                            }
                        })
                        rowData.push(qad);
                    });

                    // add data to column rows
                    $scope.gridOptions.api.setRowData(rowData);
                    $scope.gridOptions.api.sizeColumnsToFit();

                })
            }

            // validate xls file
            $scope.uploader = new FileUploader({
                alias: 'xls_file',
                url: ENV.apiCKANRoot + '/cadasta_upload_ona_form'
            });

            $scope.uploader.onBeforeUploadItem = function (item) {
                // upload required path params for CKAN to proxy
                item.formData.push({
                    project_id: cadastaProject.id
                });
            };

            $scope.uploader.onProgressItem = function (item, progress) {
                $scope.progress = progress;
            };

            // triggered when FileItem is has completed .upload()
            $scope.uploader.onCompleteItem = function (fileItem, response, status, headers) {
                $scope.response = response;
            };

            $scope.uploader.onErrorItem = function (item, response, status, headers) {
                $scope.response = response;
            }

        }
    }
]);
