import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationListService } from '../organization-list.service';


@Component({
  selector: 'app-organization-preview',
  templateUrl: './organization-preview.component.html',
  styleUrls: ['./organization-preview.service.scss']
})
export class OrganizationPreviewComponent implements OnInit {


  public isLoading = false;
  centerId: string = "0"

  /**
   * Constructor
   *
   * @param {Router} router
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _organizationListService: OrganizationListService,
  ) {
  }

  // Public Methods

  /**
   * On init
   */
  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id')
    if (itemId) {
      this.getItem(itemId);
    }
  }

  async getItem(id: string) {
    await this._organizationListService.getItem(id).then((respone: any) => {
      this.centerId = respone.innerData.id;
    })
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
  }
}
