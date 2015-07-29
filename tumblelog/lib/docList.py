from flask import current_app, flash, Blueprint, request, redirect, render_template, url_for
from flask.views import MethodView
from tumblelog.models import *
from flask.ext.mongoengine.wtf import model_form
import forms
from User import Users
from flask.ext.login import (current_user, login_required, login_user, logout_user, confirm_login, fresh_login_required)
from jinja2 import TemplateNotFound
from tumblelog import login_manager,flask_bcrypt
import logging,keywordSearch,docRecommend


class DocList(MethodView):
	def __init__(self,userObj=None,kwList=[]):
		self.uo=userObj
		self.kwList=kwList

	def getKeywords(self):
		return self.uo.keyword

	def getDocHistory(self):
		return self.uo.doc

	def doRetrieveDoc(self):
		if self.uo!=None:
			kwList=self.uo.keyword
			docList=self.uo.doc
			dr=docRecommend.DocRecommend(docList,5)
			d2=dr.doRecommend()
		if len(self.kwList)>0:
			kwList=self.kwList
			d2=set()
		ks=keywordSearch.KeywordSearch(kwList,2)
		d1=ks.doSearch()
		recSet=d1.union(d2)


		return recSet