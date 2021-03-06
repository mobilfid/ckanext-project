from ckan.plugins import toolkit
from ckan.logic.schema import (
    default_create_package_schema,
    default_show_package_schema,
    default_update_package_schema,
)
from ckanext.project.logic.validators import (
    project_name_validator,
    if_empty_generate_uuid,
    slugify_title_to_name,
    create_cadasta_project,
    update_cadasta_project,
    archive_cadasta_project, project_title_blacklist_char_validator)


convert_to_extras = toolkit.get_validator('convert_to_extras')
convert_from_extras = toolkit.get_validator('convert_from_extras')
ignore_missing = toolkit.get_validator('ignore_missing')
not_empty = toolkit.get_validator('not_empty')
not_missing = toolkit.get_validator('not_missing')
name_validator = toolkit.get_validator('name_validator')
if_empty_same_as = toolkit.get_validator('if_empty_same_as')


def project_schema():
    return {
        'country': [not_empty, unicode, convert_to_extras],
        'province_state': [ignore_missing, unicode, convert_to_extras],
        'district_county': [ignore_missing, unicode, convert_to_extras],
        'ona_api_key': [ignore_missing, unicode, convert_to_extras],
    }


def project_create_schema():
    schema = default_create_package_schema()
    schema.update({
        'id': [if_empty_generate_uuid],
        'title': [not_missing, unicode,
                  project_title_blacklist_char_validator],
        'name': [ignore_missing, unicode,
                 slugify_title_to_name,
                 project_name_validator],
        'ona_api_key': [ignore_missing, unicode],

        '__after': [create_cadasta_project],
    })
    schema.update(project_schema())
    return schema


def project_update_schema():
    schema = default_update_package_schema()
    schema.update(project_schema())
    schema.update({
        '__after': [update_cadasta_project],
    })
    return schema


def project_show_schema():
    schema = default_show_package_schema()
    schema.update({
        'country': [convert_from_extras, ignore_missing, unicode],
        'province_state': [convert_from_extras, ignore_missing, unicode],
        'district_county': [convert_from_extras, ignore_missing, unicode],
        'cadasta_id': [convert_from_extras, ignore_missing, unicode],
        'ona_api_key': [convert_from_extras, ignore_missing, unicode],
    })

    return schema

def project_archive(data,context):
    archive_cadasta_project(data,context)



