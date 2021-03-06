from functools import partial
from ckan.plugins import toolkit
from .project import has_permission_for_project

#
#  GET
#
#@toolkit.auth_allow_anonymous_access
def cadasta_get_parcels_list(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        'success': toolkit.check_access('package_show', context, data_dict)
    }

@toolkit.auth_allow_anonymous_access
def cadasta_get_project_parcel_list(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        'success': toolkit.check_access('package_show', context, data_dict)
    }

#@toolkit.auth_allow_anonymous_access
def cadasta_get_project_parcel(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        'success': toolkit.check_access('package_show', context, data_dict)
    }

@toolkit.auth_allow_anonymous_access
def cadasta_get_project_parcel_details(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        'success': toolkit.check_access('package_show', context, data_dict)
    }

#@toolkit.auth_allow_anonymous_access
def cadasta_get_project_parcel_relationship_history(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        'success': toolkit.check_access('package_show', context, data_dict)
    }

@toolkit.auth_allow_anonymous_access
def cadasta_get_project_parcel_resources(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        'success': toolkit.check_access('package_show', context, data_dict)
    }

#@toolkit.auth_allow_anonymous_access
def cadasta_get_project_parcel(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        'success': toolkit.check_access('package_show', context, data_dict)
    }

@toolkit.auth_allow_anonymous_access
def cadasta_get_project_parcel_detail(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        #'success': toolkit.check_access('package_show', context, data_dict)
    }

#@toolkit.auth_allow_anonymous_access
def cadasta_get_project_parcel_history(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        'success': toolkit.check_access('package_show', context, data_dict)
    }

@toolkit.auth_allow_anonymous_access
def cadasta_get_project_parcel_relationship_history(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        'success': toolkit.check_access('package_show', context, data_dict)
    }

@toolkit.auth_allow_anonymous_access
def cadasta_get_intersecting_parcels(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        'success': toolkit.check_access('package_show', context, data_dict)
    }

#@toolkit.auth_allow_anonymous_access
def cadasta_get_parcels_in_bbox(context, data_dict):
    data_dict.update({'id':data_dict['project_id']})
    return {
        'success': toolkit.check_access('package_show', context, data_dict)
    }


#
#  CREATE AND UPDATE
#
cadasta_create_project_parcel = partial(
    has_permission_for_project,
    permission='create_parcel',
    project_id_parameter='project_id'
)

cadasta_update_project_parcel = partial(
    has_permission_for_project,
    permission='update_parcel',
    project_id_parameter='project_id'
)

# def cadasta_create_project_parcel(context,data_dict):
#     return {
#         'success': toolkit.check_access('package_show', context, data_dict)
#     }
#
# def cadasta_update_project_parcel(context,data_dict):
#     return {
#         'success': toolkit.check_access('package_show', context, data_dict)
#     }
#
