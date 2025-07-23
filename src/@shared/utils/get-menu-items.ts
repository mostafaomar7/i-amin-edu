import {Role} from '../../app/auth/models';
import {adminMenu, instructorMenu, organizationMenu, StudentMenu} from '../../app/menu/menu';

export function getMenuItems(userType: number) {
    let menu: any;
    if (userType) {
        if (userType === Role.Admin) {
            menu = adminMenu;
        } else if (userType === Role.Center) {
            menu = organizationMenu;
        } else if (userType === Role.Teacher) {
            menu = instructorMenu;
        } else if (userType === Role.Student) {
            menu = StudentMenu;
        } else {
            // TODO: remove this else block because it is not logic to set the menu to admin if the user type is not found
            menu = adminMenu;
        }
        return menu;
    }
}
