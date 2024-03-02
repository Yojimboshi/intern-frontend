```src
src                                                     
├─ @core                                                
│  ├─ components                                        
│  │  ├─ auth                                           
│  │  ├─ card-snippet                                   
│  │  ├─ card-statistics                                
│  │  │  ├─ card-stats-horizontal                       
│  │  │  │  └─ index.tsx                                
│  │  │  ├─ card-stats-vertical                         
│  │  │  │  └─ index.tsx                                
│  │  │  ├─ card-stats-with-image                       
│  │  │  │  └─ index.tsx                                
│  │  │  └─ types.ts                                    
│  │  ├─ custom-checkbox                                
                            
│  │  ├─ custom-radio                                   
│  │  │  ├─ basic                                       
│  │  │  │  └─ index.tsx                                
│  │  │  ├─ icons                                       
│  │  │  │  └─ index.tsx                                
│  │  │  ├─ image                                       
│  │  │  │  └─ index.tsx                                
│  │  │  └─ types.ts                                    
│  │  ├─ customizer                                     
│  │  │  └─ index.tsx                                   
│  │  ├─ icon                                           
│  │  │  └─ index.tsx                                   
│  │  ├─ mui                                                                         
│  │  ├─ option-menu                                           
│  │  │  └─ index.tsx                                   
│  │  ├─ sidebar                                        
│  │  │  ├─ index.tsx                                   
│  │  │  └─ type.ts                                     
│  │  ├─ spinner                                        
│  │  │  └─ index.tsx                                   
│  │  └─ window-wrapper                                 
│  │     └─ index.tsx                                   
│  ├─ context                                           
│  │  └─ settingsContext.tsx                            
│  ├─ hooks                                             
│  │  ├─ useBgColor.tsx                                 
│  │  ├─ useClipboard.tsx                               
│  │  └─ useSettings.ts                                 
│  ├─ layouts                                           
│  │  ├─ components                                     
│  │  │  ├─ blank-layout-with-appBar                    
│  │  │  │  └─ index.tsx                                
│  │  │  ├─ horizontal                                  
│  │  │  │  ├─ app-bar-content                          
│  │  │  │  │  └─ index.tsx                             
│  │  │  │  └─ navigation                               
│  │  │  │     ├─ HorizontalNavGroup.tsx                
│  │  │  │     ├─ HorizontalNavItems.tsx                
│  │  │  │     ├─ HorizontalNavLink.tsx                 
│  │  │  │     └─ index.tsx                             
│  │  │  ├─ shared-components                           
│  │  │  │  ├─ footer                                   
│  │  │  │  │  ├─ FooterContent.tsx                     
│  │  │  │  │  └─ index.tsx                             
│  │  │  │  ├─ LanguageDropdown.tsx                     
│  │  │  │  ├─ ModeToggler.tsx                          
│  │  │  │  ├─ NotificationDropdown.tsx                 
│  │  │  │  ├─ ShortcutsDropdown.tsx                    
│  │  │  │  └─ UserDropdown.tsx                         
│  │  │  └─ vertical                                    
│  │  │     ├─ appBar                                   
│  │  │     │  └─ index.tsx                             
│  │  │     └─ navigation                               
│  │  │        ├─ Drawer.tsx                            
│  │  │        ├─ index.tsx                                     
│  │  │        └─ VerticalNavSectionTitle.tsx           
│  │  ├─ BlankLayout.tsx                                
│  │  ├─ BlankLayoutWithAppBar.tsx                                               
│  │  └─ VerticalLayout.tsx                             
│  ├─ styles                                            
│  │  ├─ libs                                                                           
│  ├─ theme                                                                       
│  │  ├─ palette                                        
│  │  │  └─ index.ts                                    
│  │  ├─ shadows                                        
│  │  │  └─ index.ts                                    
│  │  ├─ spacing                                        
│  │  │  └─ index.ts                                    
│  │  ├─ typography                                     
│  │  │  └─ index.ts                                    
│  │  ├─ globalStyles.ts                                
│  │  ├─ ThemeComponent.tsx                             
│  │  ├─ ThemeOptions.ts                                
│  │  └─ types.ts                                       
│  └─ utils                                             
│     ├─ create-emotion-cache.ts                        
                              
│     └─ types.ts                                       
├─ configs                                              
│  ├─ acl.ts                                            
│  ├─ auth.ts                                           
│  ├─ axiosConfig.ts                                    
│  ├─ i18n.ts                                           
│  └─ themeConfig.ts                                    
├─ context                                              
│  ├─ AuthContext.tsx                                   
│  └─ types.ts                                          
├─ hooks                                                
│  └─ useAuth.tsx                                       
├─ iconify-bundle                                       
│  ├─ svg                                               
│  │  └─ logo.svg                                       
│  ├─ bundle-icons-react.d.ts                           
│  ├─ bundle-icons-react.js                             
│  ├─ bundle-icons-react.ts                             
│  ├─ icons-bundle-react.js                             
│  └─ tsconfig.json                                     
├─ layouts                                              
│  ├─ components                                        
│  │  ├─ acl                                            
│  │  │  ├─ Can.tsx                                               
│  │  │  └─ getHomeRoute.tsx                            
│  │  ├─ horizontal                                     
│  │  │  ├─ AppBarContent.tsx                           
│  │  │  └─ ServerSideNavItems.tsx                      
│  │  ├─ vertical                                       
│  │  │  ├─ AppBarContent.tsx                           
│  │  │  └─ ServerSideNavItems.tsx                      
│  │  ├─ Autocomplete.tsx                                                       
│  │  └─ UserIcon.tsx                                   
│  ├─ UserLayout.tsx                                    
│  └─ UserThemeOptions.ts                               
├─ navigation                                           
│  ├─ horizontal                                        
│  │  └─ index.ts                                       
│  └─ vertical                                          
│     └─ index.ts                                       
├─ pages                                                
│  ├─ acl                                               
│  │  └─ index.tsx                                      
│  ├─ apps                                              
│  │  ├─ calendar                                       
│  │  │  └─ index.tsx                                   
│  │  ├─ chat                                           
│  │  │  └─ index.tsx                                   
│  │  ├─ email                                          
│  │  │  ├─ label                                       
│  │  │  │  └─ [label].tsx                              
│  │  │  ├─ index.tsx                                   
│  │  │  └─ [folder].tsx                                
│  │  ├─ invoice                                        
│  │  │  ├─ add                                         
│  │  │  │  └─ index.tsx                                
│  │  │  ├─ edit                                        
│  │  │  │  ├─ index.tsx                                
│  │  │  │  └─ [id].tsx                                 
│  │  │  ├─ list                                        
│  │  │  │  └─ index.tsx                                
│  │  │  ├─ preview                                     
│  │  │  │  ├─ index.tsx                                
│  │  │  │  └─ [id].tsx                                 
│  │  │  └─ print                                       
│  │  │     ├─ index.tsx                                
│  │  │     └─ [id].tsx                                 
│  │  ├─ permissions                                    
│  │  │  └─ index.tsx                                   
│  │  ├─ roles                                          
│  │  │  └─ index.tsx                                   
│  │  └─ user                                           
│  │     ├─ list                                        
│  │     │  └─ index.tsx                                
│  │     └─ view                                        
│  │        └─ [tab].tsx                                
│  ├─ charts                                                                  
│  ├─ register                                          
│  │  └─ index.tsx                                      
│  ├─ tables                                            
│  │  ├─ data-grid                                      
│  │  │  └─ index.tsx                                   
│  │  └─ mui                                            
│  │     └─ index.tsx                                   
│  ├─ ui                                                
│  │  ├─ cards                                                                          
│  │  └─ typography                                     
│  │     └─ index.tsx                                   
│  ├─ 401.tsx                                           
│  ├─ 404.tsx                                           
│  ├─ 500.tsx                                           
│  ├─ index.tsx                                         
│  ├─ _app.tsx                                          
│  └─ _document.tsx                                     
├─ store                                                                                    
├─ types                                                
│  ├─ apps                                              
│  │  ├─ calendarTypes.ts                               
│  │  ├─ chatTypes.ts                                   
│  │  ├─ emailTypes.ts                                  
│  │  ├─ invoiceTypes.ts                                
│  │  ├─ permissionTypes.ts                             
│  │  └─ userTypes.ts                                   
│  └─ forms                                             
│     └─ reactDatepickerTypes.ts                        
└─ views                                                
   ├─ apps                                              
   │  ├─ calendar                                       
   │  │  ├─ AddEventSidebar.tsx                         
   │  │  ├─ Calendar.tsx                                
   │  │  └─ SidebarLeft.tsx                             
   │  ├─ chat                                           
   │  │  ├─ ChatContent.tsx                             
   │  │  ├─ ChatLog.tsx                                         
   │  │  └─ UserProfileRight.tsx                        
   │  ├─ email                                          
   │  │  ├─ ComposePopup.tsx                            
   │  │  ├─ Email.tsx                                   
   │  │  ├─ MailDetails.tsx                             
   │  │  ├─ MailLog.tsx                                 
   │  │  └─ SidebarLeft.tsx                             
   │  ├─ invoice                                        
   │  │  ├─ add                                         
   │  │  │  ├─ AddActions.tsx                           
   │  │  │  ├─ AddCard.tsx                              
   │  │  │  └─ AddNewCustomer.tsx                       
   │  │  ├─ edit                                        
   │  │  │  ├─ Edit.tsx                                 
   │  │  │  ├─ EditActions.tsx                          
   │  │  │  └─ EditCard.tsx                             
   │  │  ├─ list                                        
   │  │  │  └─ TableHeader.tsx                          
   │  │  ├─ preview                                     
   │  │  │  ├─ Preview.tsx                              
   │  │  │  ├─ PreviewActions.tsx                       
   │  │  │  └─ PreviewCard.tsx                          
   │  │  ├─ print                                       
   │  │  │  └─ PrintPage.tsx                            
   │  │  └─ shared-drawer                               
   │  │     ├─ AddPaymentDrawer.tsx                     
   │  │     └─ SendInvoiceDrawer.tsx                    
   │  ├─ permissions                                    
   │  │  └─ TableHeader.tsx                             
   │  ├─ roles                                          
   │  │  ├─ RoleCards.tsx                               
   │  │  ├─ Table.tsx                                   
   │  │  └─ TableHeader.tsx                             
   │  ├─ user                                           
   │  │  ├─ list                                        
   │  │  │  ├─ AddUserDrawer.tsx                        
   │  │  │  └─ TableHeader.tsx                          
   │  │  └─ view                                        
   │  │     ├─ UsersInvoiceListTable.tsx                
   │  │     ├─ UsersProjectListTable.tsx                
   │  │     ├─ UserSubscriptionDialog.tsx                         
   │  │     ├─ UserViewRight.tsx                        
   │  │     └─ UserViewSecurity.tsx                     
   │  └─ v2Pools                                        
   │     ├─ components                                  
   │     ├─ PoolSearchPage.tsx                          
   │     └─ v2Pools.tsx                                 
   ├─ charts                                            
    
   ├─ components                                                    
   │  └─ tree-view                                      
   │     ├─ AddChildDrawer.tsx                          
   │     ├─ TreeViewBasic.tsx                                  
   │     └─ TreeViewSourceCode.tsx                      
   ├─ dashboards                                        
   │  ├─ analytics                                                  
   │  ├─ crm                                                                 
   │  └─ ecommerce                                                     
   ├─ forms                                             
        
   ├─ pages                                             
   │  ├─ account-settings                               
   │  │  ├─ billing                                     
   │  │  │  ├─ BillingAddressCard.tsx                   
   │  │  │  ├─ BillingHistoryTable.tsx                  
   │  │  │  ├─ CurrentPlanCard.tsx                      
   │  │  │  └─ PaymentMethodCard.tsx                    
   │  │  ├─ security                                    
   │  │  │  ├─ ChangePasswordCard.tsx                   
   │  │  │  ├─ CreateApiKey.tsx                         
   │  │  │  └─ TwoFactorAuthentication.tsx              
   │  │  ├─ AccountSettings.tsx                                                
   │  ├─ auth                                           
   │  │  ├─ register-multi-steps                        
   │  │  │  ├─ index.tsx                                
   │  │  │  ├─ StepAccountDetails.tsx                   
   │  │  │  ├─ StepBillingDetails.tsx                   
   │  │  │  └─ StepPersonalInfo.tsx                     
   │  │  ├─ FooterIllustrationsV1.tsx                   
   │  │  └─ FooterIllustrationsV2.tsx                                       
   │  ├─ faq                                            
   │  │  ├─ FaqFooter.tsx                               
   │  │  ├─ FaqHeader.tsx                               
   │  │  └─ Faqs.tsx                                    
   │  ├─ help-center                                    
   │  │  ├─ article                                     
   │  │  └─ subcategory                                 
   │  │     └─ index.tsx                                
   │  ├─ misc                                           
   │  │  └─ FooterIllustrations.tsx                     
   │  ├─ pricing                                        
   │  │  ├─ PricingCTA.tsx                              
   │  │  ├─ PricingFooter.tsx                           
   │  │  ├─ PricingHeader.tsx                           
   │  │  ├─ PricingPlans.tsx                            
   │  │  └─ PricingTable.tsx                            
   │  ├─ user-profile                                   
   │  │  ├─ connections                                 
   │  │  │  └─ index.tsx                                
   │  │  ├─ profile                                     
   │  │  │  ├─ AboutOverivew.tsx                        
   │  │  │  ├─ ActivityTimeline.tsx                     
   │  │  │  ├─ ConnectionsTeams.tsx                     
   │  │  │  ├─ index.tsx                                
   │  │  │  └─ ProjectsTable.tsx                        
   │  │  ├─ projects                                    
   │  │  │  └─ index.tsx                                
   │  │  ├─ teams                                       
   │  │  │  └─ index.tsx                                
   │  │  ├─ UserProfile.tsx                             
   │  │  └─ UserProfileHeader.tsx                       
   │  └─ wizard-examples                                             
   ├─ table                                             
   │  ├─ data-grid                                                            
   │  └─ mui                                                              
   └─ ui                                                
