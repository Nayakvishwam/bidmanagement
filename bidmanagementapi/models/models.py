from sqlalchemy import (
    Boolean, Column,
    ForeignKey, Integer,
    String, CheckConstraint,
    UniqueConstraint, Text)
from sqlalchemy.orm import relationship
from dbconfig import Base


class Companies(Base):
    __tablename__ = "company"

    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)

    auction_line_item = relationship(
        'AuctionsLinesItems', back_populates='item')


class Roles(Base):
    __tablename__ = "role"

    id = Column(Integer, autoincrement=True,
                primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)

    __table_args__ = (
        CheckConstraint("name IN ('superadmin', 'admin')",
                        name='name_valid'),
    )


class Auctions(Base):
    __tablename__ = "auction"

    id = Column(Integer, autoincrement=True,
                primary_key=True, index=True)
    description = Column(Text, index=True)
    company_id = Column(
        Integer,
        ForeignKey('company.id', ondelete='CASCADE'),
        nullable=False
    )
    company = relationship('Companies', back_populates='auction')
    auction_line = relationship(
        'AuctionsLinesItems', back_populates='auction')


class AuctionsLinesItems(Base):
    __tablename__ = "auction_line_item"

    id = Column(Integer, autoincrement=True,
                primary_key=True, index=True)
    auction_id = Column(
        Integer,
        ForeignKey('auction.id', ondelete='CASCADE'),
        nullable=False
    )
    item_id = Column(
        Integer,
        ForeignKey('item.id', ondelete='CASCADE'),
        nullable=False
    )
    quantity = Column(Integer, index=True)

    auction = relationship('Auctions', back_populates='auction_line')
    item = relationship('Items', back_populates='auction_line')


class Users(Base):
    __tablename__ = "user"

    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    password = Column(String, index=True, nullable=False)
    role_id = Column(
        Integer,
        ForeignKey('role.id', ondelete='CASCADE'),
        nullable=False
    )
    company_id = Column(
        Integer,
        ForeignKey('company.id', ondelete='CASCADE'),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint('email', name='email_uniq'),
    )


class Items(Base):
    __tablename__ = "item"

    id = Column(Integer, autoincrement=True,
                primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)

    __table_args__ = (
        UniqueConstraint('name', name='itemname_uniq'),
    )
