from nose import tools as nosetools

import ckan.model as model
import ckan.plugins.toolkit as toolkit
import ckan.tests.factories as factories
import ckan.tests.helpers as helpers

from ckanext.project.logic.converters import (
    convert_package_name_or_id_to_title_or_name,
)

from ckanext.project.logic.validators import project_name_validator

# class TestNameOrIdToTitleConverter(helpers.FunctionalTestBase):
#
#     def test_name_to_title(self):
#         '''
#         Package correctly returns title.
#         '''
#         context = {'session': model.Session}
#
#         organization = factories.Organization()
#         factories.Dataset(id='my-id', title='My Title', name='my-name', owner_org=organization['name'])
#
#         result = convert_package_name_or_id_to_title_or_name('my-name', context)
#         nosetools.assert_equals('My Title', result)
#
#     def test_name_to_name(self):
#         '''
#         Package with no title correctly returns name.
#         '''
#         context = {'session': model.Session}
#         organization = factories.Organization()
#         factories.Dataset(id='my-id', title='MyTitle', name='MyName', owner_org=organization['name'])
#
#         result = convert_package_name_or_id_to_title_or_name('my-name', context)
#         nosetools.assert_equals('my-name', result)
#
#     def test_id_to_title(self):
#         '''
#         Package correctly returns title.
#         '''
#         context = {'session': model.Session}
#         factories.Dataset(id='my-id', title='My Title', name='my-name')
#
#         result = convert_package_name_or_id_to_title_or_name('my-id', context)
#         nosetools.assert_equals('My Title', result)
#
#     def test_id_to_name(self):
#         '''
#         Package with no title correctly returns name.
#         '''
#         context = {'session': model.Session}
#         factories.Dataset(id='my-id', title='', name='my-name')
#
#         result = convert_package_name_or_id_to_title_or_name('my-id', context)
#         nosetools.assert_equals('my-name', result)
#
#     def test_with_no_package_id_exists(self):
#         '''
#         No package with id exists. Raises error.
#         '''
#         context = {'session': model.Session}
#
#         nosetools.assert_raises(toolkit.Invalid, convert_package_name_or_id_to_title_or_name,
#                                 'my-non-existent-id',
#                                 context=context)

#
# class TestProjectNameValidator(helpers.FunctionalTestBase):
#     def test_existing_name(self):
#         organization = factories.Organization()
#         factories.Dataset(id='my-id', title='project', name='project', owner_org=organization['name'])
#         context = {'package_id': 'my-id',
#                    'model': model,
#                    'session': model.Session}
#         errors = {}
#         errors['name', ] = []
#         errors['title', ] = []
#         project_name_validator(
#             key=('name',),
#             data={
#                 ('name',): 'project',
#                 ('title',): 'project',
#             },
#             errors=errors,
#             context=context
#         )
#         nosetools.assert_equals(errors['title', ],
#                                 [u'That dataset name is already in use.'])

